export const defaultLabel = {
    markup: [
        {
            tagName: 'rect',
            selector: 'body'
        }, {
            tagName: 'text',
            selector: 'label'
        }
    ],
    attrs: {
        label: {
            fill: '#333333',
            fontSize: 12,
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            fontFamily: 'sans-serif'
        },
        body: {
            ref: 'label',
            fill: '#ffffff',
            stroke: 'none',
            refX: 0,
            refY: 0,
            refWidth: '100%',
            refHeight: '100%'
        }
    },
    position: {
        distance: 0.5, // place label at midpoint by default
    }
};
