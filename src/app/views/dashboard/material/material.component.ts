import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialService } from '../../../service/material.service';
import { 
  trigger, 
  state, 
  style, 
  transition, 
  animate 
} from '@angular/animations';

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [
    CommonModule, 
    MarkdownModule,
    RouterModule
  ],
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
  animations: [   // 👈 加入動畫設定
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('expanded', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out'))
    ])
  ]
})
export class MaterialComponent {
  keypoint: string = '';
  domain: any = null;
  blocks: any[] = [];
  microConcepts: any[] = [];
  selectedMaterialContent: string | null = null;  // ✅ 用來存教材內容

  constructor(
    private materialService: MaterialService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const keypoint = params.get('keypoint');
      if (keypoint) {
        this.keypoint = keypoint;
        console.log('keypoint:', keypoint);
        this.loadDomainAndChildren();
      }
    });
  }

  loadDomainAndChildren() {
    this.materialService.getDomains().subscribe(domains => {
      this.domain = domains.find((d: any) => d.name.includes(this.keypoint));
      if (!this.domain) return;

      this.materialService.getBlocks().subscribe(allBlocks => {
        this.blocks = allBlocks
          .filter((b: any) => b.domain_id === this.domain._id)  // ✅ 過濾出該 domain 的 blocks
          .map((b: any) => ({
            ...b,
            expanded: true,
            mcs: []
          }));

        this.materialService.getMicroConcepts().subscribe(allMCs => {
          this.microConcepts = allMCs;
          this.blocks.forEach(b => {
            b.mcs = this.microConcepts.filter(mc => mc.block_id === b._id);
          });

          console.log('blocks with micro concepts:', this.blocks);
        });
      });
    });
  }

  // ✅ 點擊卡片切換展開/收起
  toggleChapter(block: any) {
    block.expanded = !block.expanded;
  }

  goBack() {
    this.router.navigate(['/dashboard/courses']);
  }

  getMicroConceptsByBlock(block: any) {
    return block.mcs || [];
  }

  // ✅ 點擊 micro concept 時，載入教材
  loadMaterial(filename: string) {
    this.materialService.getMaterial(filename).subscribe({
      next: (res) => {
        this.selectedMaterialContent = res.content;
      },
      error: (err) => {
        console.error('讀取教材失敗:', err);
        this.selectedMaterialContent = '讀取教材失敗';
      }
    });
  }
}
