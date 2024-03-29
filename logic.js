window.oncontextmenu=function() {
    return false;
}
var gamestart = false;
var MapInfo;
var len = 9;
var mine = parseInt((len**2)/6);
var flag = 0;
function IsOverRange(x, y, i, j) {
    return (x + i < 0) || (x + i >= len) || (y + j < 0) || (y + j >= len);
}
var CircularQueue = {
    "front":0,
    "back":0,
    "count":0,
    SetQueue:function(size){
        CircularQueue.QueueArr = new Array(size);
    },
    Enqueue:function(insert){
        if (CircularQueue.count < CircularQueue.QueueArr.length){
            CircularQueue.QueueArr[CircularQueue.front] = insert;
            CircularQueue.count += 1;

            if (CircularQueue.front + 1 === CircularQueue.QueueArr.length){
                CircularQueue.front = 0;
            }
            else {
                CircularQueue.front += 1;
            }
        }
        else {
            console.log("큐가 가득 참");
        }
    },
    Dequeue:function(){
        if (CircularQueue.count > 0){
            var output = CircularQueue.QueueArr[CircularQueue.back];
            CircularQueue.count -= 1;
            if (CircularQueue.back + 1 === CircularQueue.QueueArr.length){
                CircularQueue.back = 0;
            }
            else {
                CircularQueue.back += 1;
            }
            return output;
        }
        else {
            console.log("큐가 비어있음");
        }
    },
}
var Code = {
    SetSize:function(num){
        len = num;
    },
    CreateArray:function (){
        MapInfo = new Array(len);
        for (var i = 0; i < len; ++i){
            MapInfo[i] = new Array(len);
            for (var j = 0; j < len; ++j){
                MapInfo[i][j] = [0, false, false];
                // [지뢰 개수, 깃발 유무, 오픈 유무]
            }
        }
    },
    CreateMap:function(mine, exception){
        for (var i = 0; i < mine; ++i){
            var locate = this.Random(len-1, exception);
            MapInfo[locate[1]][locate[0]][0] = -1;
        }
        for (var i = 0; i < len; ++i){
            for (var j = 0; j < len; ++j){
                if (MapInfo[i][j][0] === -1){
                    continue;
                }
                var cnt = 0;
                for (var k = -1; k <= 1; ++k){
                    for (var l = -1; l <= 1; ++l){
                        if (k === 0 && l === 0){
                            continue;
                        }
                        if (IsOverRange(j,i, l,k)){
                            continue;
                        }
                        if (MapInfo[i+k][j+l][0] === -1){
                            ++cnt;
                        }
                    }
                }
                MapInfo[i][j][0]= cnt;
            }
        }
    },
    Random:function(max, exception){
        var num = new Array(2);
        while (true){
            num[0] = Math.floor(Math.random() * max + 1);
            num[1] = Math.floor(Math.random() * max + 1);
            var tempX = (num[0] - exception[0])**2;
            var tempY = (num[1] - exception[1])**2;
            if (tempX <= 1 && tempY <= 1) {
                continue;
            }
            else if (MapInfo[num[1]][num[0]][0] === -1) {
                continue;
            }
            else {
                break;
            }
        }
        return num;
    },
    SetFlag:function(nowX, nowY){
        if (MapInfo[nowY][nowX][1]) {
            MapInfo[nowY][nowX][1] = false;
            MapInfo[nowY][nowX][2] = false;
            --flag;
        }
        else if (!MapInfo[nowY][nowX][2]) {
            ++flag;
            MapInfo[nowY][nowX][1] = true;
            MapInfo[nowY][nowX][2] = true;
        }
    },
    CheckFlag:function(nowX, nowY){
        var cnt = 0;
        for (var i = -1; i <= 1; ++i){
            for (var j = -1; j <= 1; ++j){
                if (i === 0 && j === 0){
                    continue;
                }
                if (IsOverRange(nowX, nowY, j, i)){
                    continue;
                }
                if (MapInfo[nowY + i][nowX + j][1]){
                    ++cnt;
                }
            }
        }
        return cnt;
    },
    Open:function(nowX, nowY){
        if (MapInfo[nowY][nowX][0] === -1){
            alert("Game Over");
        }
        console.log(nowX, nowY);
        CircularQueue.Enqueue([nowX, nowY]);
        while (CircularQueue.count > 0){
            pos = CircularQueue.Dequeue();
            MapInfo[pos[1]][pos[0]][2] = true;
            if (MapInfo[pos[1]][pos[0]][0] === 0){
                for (var i = -1; i <= 1; ++i){
                    for (var j = -1; j <= 1; ++j){
                        if (i === 0 && j === 0){
                            continue;
                        }
                        if (IsOverRange(pos[0], pos[1], j, i)){
                            continue;
                        }
                        if (MapInfo[pos[1]+i][pos[0]+j][2]){
                            continue;
                        }
                        CircularQueue.Enqueue([pos[0]+j, pos[1]+i])
                    }
                }
            }
        }
    },
    around:function(nowX, nowY){
        if (MapInfo[nowY][nowX][0] === this.CheckFlag(nowX, nowY)){
            for (var i = -1; i <= 1; ++i){
                for (var j = -1; j <= 1; ++j){
                    if (i === 0 && j === 0){
                        continue;
                    }
                    if (IsOverRange(nowX, nowY, j, i)){
                        continue;
                    }
                    if (MapInfo[nowY+i][nowX+j][2]){
                        continue;
                    }
                    this.Open(nowX+j, nowY+i);
                }
            }
        }
    },
    isClear:function(){
        for (var i = 0; i < len; ++i){
            for (var j = 0; j < len; ++j){
                if (!MapInfo[i][j][2] && MapInfo[i][j][0] != -1){
                    return false;
                }
            }
        }
        return true;
    }
}
var Button = {
    CreateButton:function(){
        for (var i = 0; i < len; ++i){
            var d = document.createElement("div");
            d.setAttribute("id", "d"+i)
            document.querySelector("#table").appendChild(d);
            for (var j = 0; j < len; ++j){
                var b = document.createElement("button");
                b.addEventListener('mousedown', function() {
                    if ((event.button === 2) || (event.which === 3)){
                        Button.RightClick(this);
                    }
                })
                b.innerHTML = "<br>";
                b.style.backgroundColor = "rgb(200,200,200)";
                b.setAttribute("id", i + '-' + j);
                b.setAttribute("class", "comp");
                b.setAttribute("onclick", "Button.Click(this)")
                document.querySelector("#d"+i).appendChild(b);
            }
        }
    },
    Render:function() {
        for (var i = 0; i < len; ++i){
            for (var j = 0; j < len; ++j){
                var block = document.getElementById(i+'-'+j);
                block.style.backgroundColor = "rgb(200,200,200)";
                block.innerHTML = "<br>";
                if (MapInfo[i][j][2]){
                    
                    block.style.backgroundColor = "white";
                    if (MapInfo[i][j][0] != 0){
                        block.innerText = MapInfo[i][j][0];
                    }
                }
                if (MapInfo[i][j][1]){
                    block.innerText = 'V';
                    block.style.backgroundColor = "green";
                }
            }
        }
    },
    Click:function(self){
        var temp = self.getAttribute("id");
        var nowX = temp[2] - '0';
        var nowY = temp[0] - '0';
        if (!gamestart){
            gamestart = true;
            setting(nowX, nowY);
        }
        if (MapInfo[nowY][nowX][2]){
            Code.around(nowX, nowY);
        }
        else {
            Code.Open(nowX, nowY);
        }
        Button.Render();
        if(Code.isClear()){
            alert("Game Clear")
        }
    },
    RightClick:function(self){
        var temp = self.getAttribute("id");
        var nowX = temp[2] - '0';
        var nowY = temp[0] - '0';
        Code.SetFlag(nowX, nowY);
        Button.Render();
        if(Code.isClear()){
            alert("Game Clear")
        }
    },
}
function setting(nowX, nowY){
    Code.SetSize(9);
    Code.CreateArray();
    Code.CreateMap(mine, [nowX, nowY]);
    CircularQueue.SetQueue(len**2);
}