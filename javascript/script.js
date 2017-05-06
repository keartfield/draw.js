(function() {
    /**
     * Draw
     */

    // Canvasを取得
    var canvas = document.getElementById('canvas');

    // 初期値
    var options = {
        size: 5,
        alpha: 1.0,
        color: '#000',
        pen: '#000',
        background: '#fff'
    }

    // Canvasのサイズを指定
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Canvasの設定
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = options.background;

    // マウス、タッチ継続値の初期値
    var mouse = { x: '', y: '' }
    var finger = [];
    for(var i = 0; i < 10; i++){
        finger[i] = {
            x: 0, y: 0, x1: 0, y1: 0,
        };
    }

    // イベントリスナー
    canvas.addEventListener('mousedown', _click, false);
    canvas.addEventListener('mousemove', _move, false);
    canvas.addEventListener('mouseup', drawEnd, false);
    canvas.addEventListener('mouseout', drawEnd, false);
    canvas.addEventListener('touchstart', _click, false);
    canvas.addEventListener('touchmove', _move, false);

    function _move(e) {
        e.preventDefault();
        switch (e.type) {
            case 'mousemove':
                if (mouse.x === '' && mouse.y === '') { return false; }
                var rect = e.target.getBoundingClientRect();
                var X = ~~(e.clientX - rect.left);
                var Y = ~~(e.clientY - rect.top);
                //draw 関数にマウスの位置を渡す
                draw(X, Y);
                break;
            case 'touchmove':
                var rect = e.target.getBoundingClientRect();
                for(var i = 0; i < finger.length; i++){
                    finger[i].x = e.touches[i].clientX - rect.left;
                    finger[i].y = e.touches[i].clientY - rect.top;
                    ctx.beginPath();
                    ctx.moveTo(finger[i].x1,finger[i].y1);
                    ctx.lineTo(finger[i].x,finger[i].y);
                    ctx.lineCap='round';
                    ctx.lineWidth = options.size * 2;
                    ctx.strokeStyle = options.color;
                    ctx.stroke();
                    finger[i].x1 = finger[i].x;
                    finger[i].y1 = finger[i].y;

                }
                break;
            default:
                break;
        }
    }

    function _click(e) {
        e.preventDefault();
        switch (e.type) {
            case 'mousedown':
                if (e.button === 0) {
                    var rect = e.target.getBoundingClientRect();
                    var X = ~~(e.clientX - rect.left);
                    var Y = ~~(e.clientY - rect.top);
                    draw(X, Y);
                }
                break;
            case 'touchstart':
                var rect = e.target.getBoundingClientRect();
                for(var i=0;i<finger.length;i++){
                    finger[i].x1 = e.touches[i].clientX - rect.left;
                    finger[i].y1 = e.touches[i].clientY - rect.top;
                }
                break;
            default:
        }
    };

    function draw(X, Y) {
        ctx.beginPath();
        ctx.globalAlpha = options.alpha;
        if (mouse.x === '') {
            ctx.moveTo(X, Y);
        } else {
            ctx.moveTo(mouse.x, mouse.y);
        }
        ctx.lineTo(X, Y);
        ctx.lineCap = 'round';
        ctx.lineWidth = options.size * 2;
        ctx.strokeStyle = options.color;
        ctx.stroke();
        mouse.x = X;
        mouse.y = Y;
    };

    function drawEnd() {
        mouse.x = '';
        mouse.y = '';
    }

    /**
     * Menu
     */

    // イベントリスナー
    document.getElementById('pencil').addEventListener('click', _pencil, false);
    document.getElementById('clear').addEventListener('click', _clear, false);
    document.getElementById('eraser').addEventListener('click', _eraser, false);
    document.getElementById('palette').addEventListener('click', _palette, false);
    document.getElementById('save').addEventListener('click', _save, false);
    var menuIcon = document.getElementsByClassName('option-icon');
    for (i = 0; i < menuIcon.length; i++) {
        menuIcon[i].addEventListener('click', _change, false)
    }

    // リセット
    function _clear() {
        if (confirm('すべて消去しますか？')) {
            ctx.beginPath();
            ctx.fillStyle = '#fff';
            ctx.globalAlpha = 1.0;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    // ペン
    function _pencil() {
        options.color = options.pen;
    }

    // 消しゴム
    function _eraser() {
        // 現在の色を記憶
        options.pen = options.color;
        options.color = options.background;
    }

    // パレット
    function _palette() {
        document.getElementsByClassName('option')[0].classList.toggle('option_show');
    }

    // カラー、太さ、濃さを変更
    function _change() {
        if (Array.prototype.includes.call(this.classList, 'size')) {
            options.size = ~~this.dataset.size;
        }
        if (Array.prototype.includes.call(this.classList, 'color')) {
            options.color = '#' + this.dataset.color;
        }
        if (Array.prototype.includes.call(this.classList, 'alpha')) {
            options.alpha = (~~this.dataset.alpha) / 10;
        }
    }

    // 保存
    function _save() {
        var type = 'image/png';
        var dataurl = canvas.toDataURL(type);
        var bin = atob(dataurl.split(',')[1]);
        var buffer = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
        var blob = new Blob([buffer.buffer], {type: type});
        // aタグを作成してイベントを実行
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.target = '_blank';
        a.download = 'image.png';
        a.click();
    }
})();
