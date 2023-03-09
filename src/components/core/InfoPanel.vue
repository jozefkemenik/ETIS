<template>
<div class="info-panel d-flex flex-row">
<i class="fas fa-info-circle"></i>
<span class="info-panel-content">
 <slot name="content" ></slot>
 </span>


</div>
</template>
<script>

export default {
}
</script>

<style  lang="scss">
@import "@/theme/index.scss";
     $darkerColor: lighten(theme-color("primary"), 30%);
     $bgColor: lighten(theme-color("primary"), 60%);
  .info-panel {   background-color: $bgColor;
  padding:10px 10px;
  .info-panel-content{
      margin-left:10px;
      background-color: $bgColor;
      p{
              margin-bottom: 0.3rem;
        &:last-child{
            margin-bottom: 0;
        }
      }
      
  }
  border-left:3px solid $darkerColor;
  i {
      color: $darkerColor;
      font-size:24px;
  }
  }
</style>