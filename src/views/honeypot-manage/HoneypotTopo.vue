<template>
  <div class="honeypot-topo-box">
    <Card>
    <div class="honeypot-topo-box__card honeypot-topo-box__card_left">
      <DataCard title="蜜罐总数">
        <p class="honeypot-topo-box__card_content">{{totalServer}}</p>
      </DataCard>
    </div>
    <div class="honeypot-topo-box__card honeypot-topo-box__card_right">
      <DataCard title="受攻击蜜罐数">
        <p class="honeypot-topo-box__card_content red">{{attackedServerNum}}</p>
      </DataCard>
    </div>
    <div class="topo-container" ref="topoContainer"></div>
    </Card>
  </div>
</template>

<script>
import G6 from './G6';

import Card from '@/components/Card'
import DataCard from '@/views/datav/DataCard'
import env from '@/env.config.js'
export default {
  name: 'HoneypotTopo',
  components: { Card, DataCard },
  data() {
    return {
      graph: null,
      totalServer: 0,
      attackedServerNum: 0,
      getTopoDataTimer: 0,
      topoData: {}
    }
  },
  watch: {
    topoData: {
      handler(val) {
        if (this.graph) {
          this.graph.changeData(val)
        } else {
          this.initTopo(val)
        }
      },
    }
  },
  mounted() {
    this.initWebSocket()
  },
  methods: {
    initWebSocket(){
      const isFullPath =  /^(https|http)/.test(env[window.__env__ || 'default'].VUE_APP_PUBLIC_URL)
      //初始化
      const baseUrl = isFullPath?env[window.__env__ || 'default'].VUE_APP_PUBLIC_URL.replace(/(https|http)/,'ws'):`ws://${window.location.hostname}:8082${env[window.__env__ || 'default'].VUE_APP_PUBLIC_URL}`
      this.websocket = new WebSocket(`${baseUrl}/topology/map`)
      var that = this.websocket
      that.onopen = this.websocketonopen
      that.onerror = this.websocketonerror
      that.onmessage = this.websocketonmessage
      that.onclose = this.websocketclose
    },
    websocketonopen() {
      //发送
      // this.websocket.send('');
      console.log("WebSocket连接成功");
    },
    websocketonerror(e) {
      //错误
      console.log("WebSocket连接发生错误");
    },
    websocketonmessage(e){
      //数据接收
      //处理逻辑
      const msg = JSON.parse(e.data)
      
      if (msg.type === 3) {
        const data = msg.content
        const {nodes, lines: edges, potNum, attackedPotNum} = data
        const attackedEdges = edges.filter(edge =>edge.status === 'RED')
        const virturalEdges = edges.filter(edge =>edge.status === 'VIRTUAL')

        attackedEdges.forEach(edge => {
          edge.type = 'circle-running'
        })
        virturalEdges.forEach(edge => {
          edge.style = {}
          edge.style.lineDash = [5]
        })
        nodes.forEach(node => {
          const isAttackedNode = this.isAttackedNode(node, attackedEdges)
          const nodeTypeImageMap = {
            'HACK': 'hacker',
            'EDGE': 'server',
            'RELAY': 'server-net',
            'POD': 'honeypot'
          }
          const img = nodeTypeImageMap[node.nodeType]
          const nodeImageName = node.nodeType === 'POD' && isAttackedNode ? `${img}-red`: img
          node.img = require(`@/assets/images/${nodeImageName}.svg`)
          node.type = isAttackedNode ? 'background-animate' : 'image'
        });
        this.totalServer = potNum
        this.attackedServerNum = attackedPotNum
        this.topoData = {
          nodes,
          edges
        }
      }
    },

    websocketclose(e){
      //关闭
      console.log("connection closed (" + e.code + ")");
    },
    async initTopo(data) {
      const container = this.$refs.topoContainer
      const width = container.clientWidth
      const height = container.clientHeight
 
      this.graph = new G6.Graph({
        container: container, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width, // Number，必须，图的宽度
        height, // Number，必须，图的高度
        // fitCenter: true,
        fitView: true,
        modes: {
          default: ['drag-canvas', 'zoom-canvas', {
            type: 'tooltip', // 提示框
            formatText(model) {
              // 提示框文本内容
              const text = 'ip: ' + model.ip + '<br/> hostName: ' + model.hostName;
              return text;
            },
          }], // 允许拖拽画布、放缩画布、拖拽节点
        },
        defaultNode: {
          type: 'image',
          size: 40,
          color: '#F56C6C',
          labelCfg: {
            position: 'bottom',
            style: {
              fill: '#fff',
            },
          },
          clipCfg: {
            show: true,
            type: 'circle',
            r: 25
          },
        },
        layout: {
          // type: 'dendrogram',
          type: 'dagre',
          // rankdir: 'LR',
          // align: 'DL',
          // type: 'fruchterman',
          // type: 'force',
          linkDistance: 100,
          // rankdir:'LR',
          // workerEnabled: true
        },
      });
      this.graph.data(data); // 读取 Step 2 中的数据源到图上
      this.graph.render(); // 渲染图
      window.onresize = () => {
        if (!this.graph || this.graph.get('destroyed')) return;
        if (!container || !container.clientWidth || !container.clientHeight) return;
        this.graph.changeSize(container.clientWidth, container.clientHeight);
        this.graph.fitView()
        // this.graph.fitCenter()
      };
    },

    isAttackedNode(node, attackedEdges) {
      return attackedEdges.filter(edge => edge.target === node.id).length > 0
    },
  },

  beforeDestroy() {
    this.graph && this.graph.destroy()
    this.websocket.close()
  },
}
</script>

<style lang="less">
@import "../../assets/style/var";

.honeypot-topo-box {
  padding: 10px;
  position: relative;
  min-height: 300px;
  overflow: auto;
  .card {
    height: 100%;
    background: #040E21 url("~@/views/datav/imges/bg-img.png") repeat!important;
    .card-body {
      height: 100%;
    }
  }
  .topo-container {
    position: absolute;
    left: 30px;
    right: 30px;
    bottom: 50px;
    top: 130px;
  }
  &__card {
    width: 200px;
    height: 100px;
    position: absolute;
    &_left {
      left: 30px;
      top: 30px;
    }
    &_right {
      right: 30px;
      top: 30px;
    }
    &_content {
      line-height: 40px;
      font-size: 20px;
      color: #fff;
      text-align: center;
    }
    &_content.red {
      color: #F56C6C;
    }
  }
}

.is-card-last {
  margin-bottom: 0px;
}
.g6-tooltip {
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  font-size: 12px;
  color: #545454;
  line-height: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 8px;
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
}

</style>
