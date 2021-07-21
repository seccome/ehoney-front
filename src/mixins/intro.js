export default {
  methods: {
    initIntro(pageName, steps) {
      const that = this
      var enjoyhint_instance = new window.EnjoyHint({
        onEnd: function () {
          const visitedPages = that.getVisitedPages()
          if (!that.isPageVisited(pageName)) {
            visitedPages.push(pageName)
            window.sessionStorage.setItem('visitedPage', visitedPages.join(','))
          }
        },
      });
      var enjoyhint_script_steps = steps

      //set script config
      enjoyhint_instance.set(enjoyhint_script_steps);

      //run Enjoyhint script
      enjoyhint_instance.run();

    },
    isFirstLogin () {
      return window.sessionStorage.getItem('isFirstLogin') === 'true'
    },
    isPageVisited (pageName) {
      const visitedPages = this.getVisitedPages()
      return visitedPages.includes(pageName)
    },
    getVisitedPages() {
      const visitedPage = window.sessionStorage.getItem('visitedPage')
      return visitedPage ? visitedPage.split(',') :[]
    },
  }
}
