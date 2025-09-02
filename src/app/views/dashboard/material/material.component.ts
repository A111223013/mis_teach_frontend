import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialService } from '../../../service/material.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-material',
  standalone: true,   // ✅ Standalone component
  imports: [CommonModule, MarkdownModule],  // ✅ 匯入 markdown
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']  // ✅ 改成複數
})
export class MaterialComponent {
  keypoint: string = '';
  domain: any = null;
  blocks: any[] = [];
  microConcepts: any[] = [];

  constructor(
    private materialService: MaterialService,
    private route: ActivatedRoute
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

      const domainBlockIds = this.domain.blocks; // ["block_1","block_2"]

      this.materialService.getBlocks().subscribe(allBlocks => {
        console.log('all blocks:', allBlocks);
        
        // 直接取所有 blocks（因為後端沒有完全對應的 id）
        this.blocks = allBlocks;
        
        this.materialService.getMicroConcepts().subscribe(allMCs => {
          // 過濾 micro concept 對應 domain.blocks
          this.microConcepts = allMCs.filter(mc =>
            domainBlockIds.includes(mc.block_id)
          );

          // 將 micro concepts 分組到各 block
          this.blocks.forEach(b => {
            b.mcs = this.microConcepts.filter(mc =>
              b.subtopics.includes(mc._id) || domainBlockIds.includes(mc.block_id)
            );
          });

          console.log('blocks with micro concepts:', this.blocks);
        });
      });
    });
  }

  getMicroConceptsByBlock(block: any) {
    return block.mcs || [];
  }

}

