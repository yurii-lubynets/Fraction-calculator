<template>
    <div class="container">
        <div class="comment-item" v-for="(comment, index) in comments" :key="index" :id="comment.id">
            <div class="comment-author">{{comment.id}} - {{comment.author}}</div>
            <button @click="$_sendMessage(comment.id)">Delete</button>
            <div class="comment-text">{{comment.text}}</div>
        </div>
    </div>
</template>

<script>

import Socket from '../socket.js'

export default {
    name: 'WebSocketComments',
    data () {
        return {
            comments: [
                {id: 0, author: 'A', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer rutrum ultrices varius. Pellentesque ipsum mi, efficitur fringilla eleifend a, faucibus ac dolor. Suspendisse ultrices erat dolor, at suscipit tortor ultrices ut.'},
                {id: 1, author: 'B', text: 'Mauris ut egestas nisl. Cras fringilla sodales lorem, id condimentum sapien faucibus vel. Pellentesque hendrerit libero eu ante dapibus, in finibus mi blandit.'},
                {id: 2, author: 'C', text: 'Cras libero nulla, accumsan a neque nec, volutpat dictum turpis. Duis convallis, mi faucibus malesuada varius, nisl neque vehicula purus, id commodo mi sapien id justo. '},
                {id: 3, author: 'D', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisl dui, tincidunt ut bibendum eget, venenatis ut nisi.'},
                {id: 4, author: 'E', text: 'Vestibulum sagittis, eros eget facilisis egestas, erat arcu finibus sapien, a mattis diam velit sed mi. Nulla sodales nibh tortor, et laoreet turpis auctor ut. '},
                {id: 5, author: 'F', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer rutrum ultrices varius. Pellentesque ipsum mi, efficitur fringilla eleifend a, faucibus ac dolor. Suspendisse ultrices erat dolor, at suscipit tortor ultrices ut.'},
                {id: 6, author: 'G', text: 'Mauris ut egestas nisl. Cras fringilla sodales lorem, id condimentum sapien faucibus vel. Pellentesque hendrerit libero eu ante dapibus, in finibus mi blandit.'},
                {id: 7, author: 'H', text: 'Cras libero nulla, accumsan a neque nec, volutpat dictum turpis. Duis convallis, mi faucibus malesuada varius, nisl neque vehicula purus, id commodo mi sapien id justo. '},
                {id: 8, author: 'I', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisl dui, tincidunt ut bibendum eget, venenatis ut nisi.'},
                {id: 9, author: 'J', text: 'Vestibulum sagittis, eros eget facilisis egestas, erat arcu finibus sapien, a mattis diam velit sed mi. Nulla sodales nibh tortor, et laoreet turpis auctor ut. '}
            ]
        }
    },
    created () {
        Socket.$on('message', this.$_handleMessage);
    },
    beforeDestroy () {
        Socket.$off('message', this.$_handleMessage);
    },
    methods: {
        $_sendMessage: function (id) {
            Socket.send(id);
        },
        $_handleMessage: function (id) {
            this.comments = this.comments.filter(item => item.id != id);
        }
    },
}
</script>

<style lang="less" scoped>
    .container {
        display: block;
        margin: 20px auto;
        width: 50%;
        padding: 20px;
        border: 1px solid #ccc;
        background: #eee;
    }
    .comment {
        &-item {
            border-bottom: 1px solid #ccc;
            padding: 15px;
            &:last-child {
                border: 0;
            }
        }
        &-author {
            float: left;
            font-weight: bold;
        }
        &-text {
            overflow: hidden;
            width: 100%;
            text-align: left;
            padding: 10px 0 0;
        }
    }
    button {
        float: right;
        border: 0;
        padding: 5px;
        background: #ff000059;
    }
</style>