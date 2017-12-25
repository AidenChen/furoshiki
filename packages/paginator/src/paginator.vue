<template>
  <div class="f-paginator">
    <div class="f-paginator__comment f-paginator__total" v-if="layout.indexOf('total') !== -1">
      共
      {{total}}
      条
    </div>
    <div class="f-paginator__comment f-paginator__sizer" v-if="layout.indexOf('sizer') !== -1">
      每页
      <select v-model="currentSize">
        <option v-for="(size, index) in pageSizes" :key="index">{{size}}</option>
      </select>
      条
    </div>
    <ul class="f-paginator__pager" :class="{'f-paginator__pager--background': background}">
      <li class="f-paginator__number" :class="{'f-paginator__number--disabled': pageIndex === 1}" @click="prevPage()">
        &lt;
      </li>
      <li class="f-paginator__number" v-for="(number, index) in numbers" :key="index"
          :class="{'f-paginator__number--active': number === pageIndex, 'f-paginator__number--separated': number === '...'}" @click="changePage(number)">
        {{number}}
      </li>
      <li class="f-paginator__number" :class="{'f-paginator__number--disabled': pageIndex === pageCount}" @click="nextPage()">
        &gt;
      </li>
    </ul>
    <div class="f-paginator__comment f-paginator__jumper" v-if="layout.indexOf('jumper') !== -1">
      前往
      <input type="text" v-model="currentIndex" @keyup="jumpToPage($event)"/>
      页
    </div>
  </div>
</template>

<script>
export default {
  name: 'FPaginator',
  data () {
    return {
      // 跳转输入框中的当前页码
      currentIndex: 0,
      // 当前选中的每页显示条目个数
      currentSize: 0
    }
  },
  props: {
    // 当前页码
    pageIndex: {
      type: Number,
      default () {
        return 1
      }
    },
    // 每页显示条目个数
    pageSize: {
      type: Number,
      default () {
        return 10
      }
    },
    // 总条目数
    total: {
      type: Number,
      default () {
        return 0
      }
    },
    // 分页器长度，即显示的页码个数
    pagerLength: {
      type: Number,
      default () {
        return 5
      }
    },
    // 每页显示条目个数选择器的选项设置
    pageSizes: {
      type: Array,
      default () {
        return [10, 20, 30, 40, 50]
      }
    },
    // 组件布局
    layout: {
      type: String,
      default () {
        return 'total, sizer, pager, jumper'
      }
    },
    // 是否为分页按钮添加背景色
    background: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  computed: {
    // 总页码数
    pageCount () {
      return this.total ? Math.ceil(this.total / this.currentSize) : 1
    },
    // 页码内容
    numbers () {
      const numbers = []
      if (this.pageCount <= this.pagerLength + 2) {
        for (let i = 1; i <= this.pageCount; i++) {
          numbers.push(i)
        }
        return numbers
      }
      const pagerLength = (this.pagerLength % 2 === 0) ? this.pagerLength - 1 : this.pagerLength
      const offset = (pagerLength - 1) / 2
      if (this.pageIndex <= pagerLength) {
        for (let i = 1; i <= pagerLength + 1; i++) {
          numbers.push(i)
        }
        numbers.push('...')
        numbers.push(this.pageCount)
      } else if (this.pageIndex > this.pageCount - pagerLength) {
        numbers.push(1)
        numbers.push('...')
        for (let i = this.pageCount - pagerLength; i <= this.pageCount; i++) {
          numbers.push(i)
        }
      } else {
        numbers.push(1)
        if (this.pageIndex - 1 > 1) {
          numbers.push('...')
        }
        for (let i = this.pageIndex - offset; i < this.pageIndex; i++) {
          numbers.push(i)
        }
        numbers.push(this.pageIndex)
        for (let i = this.pageIndex + 1; i <= this.pageIndex + offset; i++) {
          numbers.push(i)
        }
        if (this.pageIndex + 1 < this.pageCount) {
          numbers.push('...')
        }
        numbers.push(this.pageCount)
      }
      return numbers
    }
  },
  watch: {
    currentSize (newValue, oldValue) {
      if (!oldValue) {
        return
      }
      this.changePage(this.pageIndex, parseInt(this.currentSize, 10))
    }
  },
  created () {
    this.fixPageSizes()
    this.currentIndex = this.pageIndex
    this.currentSize = this.pageSize
  },
  methods: {
    // 跳转页面
    changePage (index, size) {
      if (index === '...' || (index === this.pageIndex && !size)) {
        return
      }
      const newIndex = this.fixPageIndex(index ? parseInt(index, 10) : 1)
      this.currentIndex = newIndex
      const newSize = size || parseInt(this.currentSize, 10)
      this.$emit('page-changed', newIndex, newSize)
    },
    // 上一页
    prevPage () {
      let newIndex = this.pageIndex
      if (newIndex > 1) {
        newIndex -= 1
      }
      this.changePage(newIndex)
    },
    // 下一页
    nextPage () {
      let newIndex = this.pageIndex
      if (newIndex < this.pageCount) {
        newIndex += 1
      }
      this.changePage(newIndex)
    },
    // 输入页码跳转页面
    jumpToPage () {
      const newIndex = this.currentIndex.toString().replace(/[^0-9]/g, '')
      this.changePage(newIndex)
    },
    // 调整页码
    fixPageIndex (index) {
      let newIndex = index
      if (newIndex <= 1) {
        newIndex = 1
      }
      if (this.pageCount > 0 && newIndex >= this.pageCount) {
        newIndex = this.pageCount
      }
      return newIndex
    },
    // 调整每页显示条目个数选择器的选项
    fixPageSizes () {
      const pageSizesLength = this.pageSizes.length
      let pageSizesStatus
      for (let i = 0; i < pageSizesLength; i++) {
        if (parseInt(this.pageSizes[i], 10) === parseInt(this.pageSize, 10)) {
          pageSizesStatus = true
          break
        }
      }
      if (!pageSizesStatus) {
        this.pageSizes.push(this.pageSize)
      }
      this.pageSizes.sort((x, y) => x - y)
    }
  }
}
</script>
