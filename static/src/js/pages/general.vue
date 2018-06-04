<template lang="pug">
  .container
    .mt-4.mt-sm-6(v-html="contentTransformed")
</template>
<script>
  import {win} from "@/js/global";

  const w = win();

  export default {
    data: () => ({
      content: w.__state__.general.content,
      contentTransformed: ''
    }),
    async mounted() {
      let result,
        reg = /<script[\s\S]*?>([\s\S]*?)<\/script>/gi,
        body = document.body,
        content = this.content;

      const appendScript = (src, text) => new Promise(resolve => {
        if (src.length === 0 && text.length === 0) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        if (src) {
          script.src = src;
          script.onload = () => resolve();
        } else {
          script.text = text;
          resolve();
        }
        body.appendChild(script);
      });

      while ((result = reg.exec(this.content)) !== null) {
        const src = /src=\"([^\"]*)/.exec(result[0]);
        await appendScript(src ? src[1].trim() : '', result[1].trim());
        content = content.replace(result[0], '');
      }

      this.contentTransformed = content;
    }
  }
</script>
