import G6 from '@antv/g6';
G6.registerEdge(
  'circle-running',
  {
    afterDraw(cfg, group) {
      // get the first shape in the group, it is the edge's path here=
      const shape = group.get('children')[0];
      shape.attr('stroke', '#F56C6C')
      // the start position of the edge's path
      const startPoint = shape.getPoint(0);
      // add red circle shape
      const circle = group.addShape('circle', {
        attrs: {
          x: startPoint.x,
          y: startPoint.y,
          fill: '#F56C6C',
          r: 3,
        },
        name: 'circle-shape',
      });

      // animation for the red circle
      circle.animate(
        (ratio) => {
          // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
          // get the position on the edge according to the ratio
          const tmpPoint = shape.getPoint(ratio);
          // returns the modified configurations here, x and y here
          return {
            x: tmpPoint.x,
            y: tmpPoint.y,
          };
        },
        {
          repeat: true, // Whether executes the animation repeatly
          duration: 2500, // the duration for executing once
        },
      );
    },
  },
  'line', // extend the built-in edge 'cubic'
);
// Background Animation
G6.registerNode(
  'background-animate',
  {
    afterDraw(cfg, group) {
      const r = cfg.size / 2;
      const back1 = group.addShape('circle', {
        zIndex: -3,
        attrs: {
          x: 0,
          y: 0,
          r,
          fill: cfg.color,
          opacity: 0.6,
        },
        name: 'back1-shape',
      });
      const back2 = group.addShape('circle', {
        zIndex: -2,
        attrs: {
          x: 0,
          y: 0,
          r,
          fill: cfg.color,
          opacity: 0.6,
        },
        name: 'back2-shape',
      });
      const back3 = group.addShape('circle', {
        zIndex: -1,
        attrs: {
          x: 0,
          y: 0,
          r,
          fill: cfg.color,
          opacity: 0.6,
        },
        name: 'back3-shape',
      });
      group.sort(); // Sort according to the zIndex
      back1.animate(
        {
          // Magnifying and disappearing
          r: r + 10,
          opacity: 0.1,
        },
        {
          duration: 3000,
          easing: 'easeCubic',
          delay: 0,
          repeat: true, // repeat
        },
      ); // no delay
      back2.animate(
        {
          // Magnifying and disappearing
          r: r + 10,
          opacity: 0.1,
        },
        {
          duration: 3000,
          easing: 'easeCubic',
          delay: 1000,
          repeat: true, // repeat
        },
      ); // 1s delay
      back3.animate(
        {
          // Magnifying and disappearing
          r: r + 10,
          opacity: 0.1,
        },
        {
          duration: 3000,
          easing: 'easeCubic',
          delay: 2000,
          repeat: true, // repeat
        },
      ); // 3s delay
    },
  },
  'image',
);
export default G6
