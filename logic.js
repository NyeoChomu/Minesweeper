var lenY = 21;
var lenX = 21;
var MapInfo;
var Stack = {
    "top":0,
    setArr:function(size){
        Stack.stackArr = new Array(size);
    },
    push:function(data){
        if (Stack.top + 1 < Stack.stackArr.length){
            Stack.stackArr[Stack.top] = data;
            ++Stack.top;
        }
        else {
            console.log("스택이 가득 참");
        }
    },
    pop:function(){
        if (Stack.top > 0) {
            --Stack.top;
            return (Stack.stackArr[Stack.top]);
        }
        else {
            console.log("스택이 비었음");
        }
    },
}
var Code = {
    SetMap:function(){
        MapInfo = new Array(lenY);
        for (var i = 0; i < lenY; ++i){
            MapInfo[i] = new Array(lenX);
            for (var j = 0; j < lenX; ++j){
                if (i % 2 != 0 && j % 2 != 0){
                    MapInfo[i][j] = [-1,0];
                }
                else {
                    MapInfo[i][j] = [1,0];
                }
            }
        }
    },
    CreateMaze:function(){
        var nowX = 1;
        var nowY = 1;
        Stack.push([nowY,nowX]);
        Maker : while (Stack.top > 0) {
            MapInfo[nowY][nowX][0] = 0;
            var direction = Code.shuffle([[0,-1],[0,1],[-1,0],[1,0]])
            Checker : for (var i = 0; i < 4; ++i){
                if (Code.IsOverRange(nowY,direction[i][0]*2,nowX,direction[i][1]*2)){
                    continue Checker;
                }
                else if (MapInfo[nowY+direction[i][0]*2][nowX+direction[i][1]*2][0] === 0){
                    continue Checker;
                }
                else {
                    MapInfo[nowY+direction[i][0]][nowX+direction[i][1]][0] = 0;
                    Stack.push([nowY+direction[i][0]*2,nowX+direction[i][1]*2]);
                    nowY += direction[i][0]*2;
                    nowX += direction[i][1]*2;
                    continue Maker;
                }
            }
            [nowY, nowX] = Stack.pop();
        }
        MapInfo[1][1][1] = 1;
        MapInfo[lenY-2][lenX-1][0] = 2;
    },
    Move:function(targetY, targetX) {
        if (MapInfo[targetY][targetX][0] === 1) {
            return;
        }
        var nowY = -1;
        var nowX = -1;
        Finder : for (var i = 1; i < (lenY-1); ++i){
            for (var j = 1; j < (lenX-1); ++j){
                if (j === 21){
                    console.log(j);
                }
                if (MapInfo[i][j][1] === 1){
                    [nowY, nowX] = [i, j];
                    break Finder;
                }
            }
        }
        if (nowY === -1){
            return;
        }
        if (nowY === targetY) {
            for (var i = nowX; i != targetX; targetX > nowX ? ++i : --i){
                if (MapInfo[nowY][i][0] === 1){
                    return;
                }
            }
        }
        else if (nowX === targetX) {
            for (var i = nowY; i != targetY; targetY > nowY ? ++i : --i){
                if (MapInfo[i][nowX][0] === 1){
                    return;
                }
            }
        }
        else {
            return;
        }
        MapInfo[nowY][nowX][1] = 0;
        MapInfo[targetY][targetX][1] = 1;
    },
    IsGoal() {
        return MapInfo[lenY-2][lenX-1][1] === 1;
    },
    shuffle:function(array) {
        for (let i = array.length - 1; i > 0; i--) {
              // 무작위로 index 값 생성 (0 이상 i 미만)
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    },
    IsOverRange:function(y1,y2,x1,x2){
        return y1 + y2 < 0 || y1 + y2 >= lenY || x1 + x2 < 0 || x1 + x2 >= lenX;
    }
}
var Button = {
    CreateButton:function(){
        for (var i = 0; i < lenY; ++i){
            var row = document.createElement("div");
            row.setAttribute("id", "d"+i)
            document.getElementById("table").appendChild(row);
            for (var j = 0; j < lenX; ++j){
                var block = document.createElement("button");
                block.innerHTML = "<br>";
                block.style.backgroundColor = "white";
                if (MapInfo[i][j][0] === 1){
                    block.style.backgroundColor = "black";
                }
                else if (MapInfo[i][j][0] === 2) {
                    block.style.backgroundColor = "green";
                }
                block.setAttribute("id", i + '-' + j);
                block.setAttribute("class", "comp");
                block.setAttribute("onclick", "Button.Click(this)")
                row.appendChild(block);
            }
        }
    },
    Render:function(){
        for (var i = 0; i < lenY; ++i){
            for (var j = 0; j < lenX; ++j){
                var block = document.getElementById(i+"-"+j);
                if (MapInfo[i][j][0] === 0){
                    block.style.backgroundColor = "white";
                }
                else{
                    block.style.backgroundColor = "black";
                }
                
                if (MapInfo[i][j][0] === 2) {
                    block.style.backgroundColor = "green";
                }
                
                if (MapInfo[i][j][1] === 1) {
                    block.style.backgroundColor = "red";
                }
            }
        }
    },
    Click(self){
        var pos = self.getAttribute("id").split('-');
        Code.Move(Number(pos[0]), Number(pos[1]));
        Button.Render();
        if (Code.IsGoal()){
            alert("Game Clear!");
        }
    },
}
function setting(){
    [lenX, lenY] = prompt("미로 크기를 입력하세요 : (x) * (y)").split("*");
    lenX = lenX*2+1;
    lenY = lenY*2+1;
    Stack.setArr(lenY*lenX);
    Code.SetMap();
    Code.CreateMaze();
    Button.CreateButton();
    Button.Render();
}