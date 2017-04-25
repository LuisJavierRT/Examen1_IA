var abc = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","ñ","o","p","q","r","s","t","u","v","w","x","y","z"];
var idNode = undefined;
var idEdges = [];
var data = {};
var network = undefined;
var container = undefined;
var logicNetwork = [];
var solutionFinal = [];
var json;
var startTime, endTime, timeElapsed;
var options = {
    stabilize: false,
    dataManipulation: true,
    onAdd: function(data,callback) {
        var span = document.getElementById('operation');
        var idInput = document.getElementById('node-id');
        var labelInput = document.getElementById('node-label');
        var saveButton = document.getElementById('saveButton');
        var cancelButton = document.getElementById('cancelButton');
        var div = document.getElementById('network-popUp');
        span.innerHTML = "Add Node";
        idInput.value = logicNetwork.length+1;
        saveButton.onclick = saveNodeData.bind(this,data,"I",callback);
        cancelButton.onclick = clearPopUp.bind();
        div.style.display = 'block';
    },
    onEdit: function(data,callback) {
        var span = document.getElementById('operation');
        var idInput = document.getElementById('node-id');
        var labelInput = document.getElementById('node-label');
        var saveButton = document.getElementById('saveButton');
        var cancelButton = document.getElementById('cancelButton');
        var div = document.getElementById('network-popUp');
        span.innerHTML = "Edit Node";
        idInput.value = data.id;
        labelInput.value = data.label;
        saveButton.onclick = saveNodeData.bind(this,data,"E",callback);
        cancelButton.onclick = clearPopUp.bind();
        div.style.display = 'block';
    },
    onEditEdge: function(data, callback){
        var span = document.getElementById('operation');
        var idInput = document.getElementById('node-id');
        var labelInput = document.getElementById('node-label');
        var saveButton = document.getElementById('saveButton');
        var cancelButton = document.getElementById('cancelButton');
        var div = document.getElementById('network-popUp');
        span.innerHTML = "Edit Edge";
        idInput.value = data.id;
        saveButton.onclick = saveEdgeData.bind(this,data,"E",callback);
        cancelButton.onclick = clearPopUp.bind();
        div.style.display = 'block';
    },
    onConnect: function(data,callback) {
        var span = document.getElementById('operation');
        var idInput = document.getElementById('node-id');
        var labelInput = document.getElementById('node-label');
        var saveButton = document.getElementById('saveButton');
        var cancelButton = document.getElementById('cancelButton');
        var div = document.getElementById('network-popUp');
        span.innerHTML = "Add Edge";
        idInput.value = "None";
        saveButton.onclick = saveEdgeData.bind(this,data,"I",callback);
        cancelButton.onclick = clearPopUp.bind();
        div.style.display = 'block';
    },
    onDelete: function(data, callback){
       callback(data);
       deleteNode(data.nodes[0]);
    }
}; 

var auto_graph = function(number){
    logicNetwork = []
    var listaNodes = [];
    var listaEdges = [];
    var n = randomNumber(number,1);
    console.log("Random: " + n);
    for (var i = 1; i <= n; i++) {
        var node = {
            id: i,
            label: abc[i-1],
            initial: false,
            final: false,
            visited: false
        };
        listaNodes.push(node);
    }
    var nodes = new vis.DataSet(listaNodes);

    for (var i = 1; i <= n; i++) {
        var m = randomNumber(5,0);
        if(m>n) {
            m = n;
        }
        var uniques = chance.unique(chance.natural, m, {min: 1, max: n});
        var listaEd = [];

        for (var j = 0; j < uniques.length; j++) {
            var val = randomNumber(10,1);
            var edge = {
                from: i,
                to: uniques[j],
                label: val,
                color: "blue"
            };
            listaEdges.push(edge);
            listaEd.push({to: uniques[j], weigth: val});
        }
        logicNetwork.push({id: i, name: abc[i-1], visited: false, final: false, initial: false, edges: listaEd});
    }
    console.log(logicNetwork);
    var edges = new vis.DataSet(listaEdges);
    // create a network
    container = document.getElementById('mynetwork');

    // provide the data in the vis format
    data = {
        nodes: nodes,
        edges: edges
    };
    // initialize your network!
    if (n<=100){
        network = new vis.Network(container, data, options);
    
        network.on("select", function (params) {
            idNode = params.nodes[0];
            idEdges = params.edges;
        }); 
    }
};

var setStates = function() {
    logicNetwork[1000].initial = true;
    logicNetwork[logicNetwork.length-2000].final = true;
};


var createAutoGraph = function(){
    var num = document.getElementById("num").value;
    if(num != undefined){
        auto_graph(num);
        setStates();
    }
};

var clearPopUp = function() {
    var saveButton = document.getElementById('saveButton');
    var cancelButton = document.getElementById('cancelButton');
    saveButton.onclick = null;
    cancelButton.onclick = null;
    var div = document.getElementById('network-popUp');
    div.style.display = 'none';
};

var saveEdgeData = function(data, action, callback) {
    var idInput = document.getElementById('node-id');
    var labelInput = document.getElementById('node-label');
    var div = document.getElementById('network-popUp');
    if(action == "I"){
        data.label = parseInt(labelInput.value);
        data.color = "blue";
        clearPopUp();
        callback(data);
        for(var i=0; i<logicNetwork.length; i++) {
            if(logicNetwork[i].id == data.from) {
                var edge = {to: data.to, weigth: data.label};
                logicNetwork[i].edges.push(edge);
                break;
            }
        }
    }
    else{
        data.id = parseInt(idInput.value);
        data.label = parseInt(labelInput.value);
        clearPopUp();
        callback(data);
        for(var i=0; i<logicNetwork.length; i++) {
            for(var j=0; j<logicNetwork[i].edges.length; j++) {
                if(logicNetwork[i].id == data.from) {
                    logicNetwork[i].edges[j].to = data.to;
                    logicNetwork[i].edges[j].weigth = data.label;
                    break;
                }
            }
        }
    }
};

var saveNodeData = function(data,action,callback) {
    var idInput = document.getElementById('node-id');
    var labelInput = document.getElementById('node-label');
    var div = document.getElementById('network-popUp');
    data.id = parseInt(idInput.value);
    data.label = labelInput.value;
    clearPopUp();
    if(action == "I"){
        data.visited = false;
        data.initial = false;
        data.final = false;
        callback(data);
        var node = {
            id: data.id, 
            name: data.label, 
            visited: data.visited, 
            final: data.final, 
            initial: data.initial, 
            edges: []
        };
        logicNetwork.push(node);
    }
    else{
        callback(data);
        for(var i=0; i<logicNetwork.length; i++) {
            if(logicNetwork[i].id == data.id) {
                logicNetwork[i].name = data.label;
                break;
            }
        }
    }
}

var randomNumber = function(n1,n2){
    return Math.floor(Math.random()*n1)+n2;
};

var setInitialState = function(){
    if(idNode != undefined){
        data.nodes.update({id: idNode, initial: true, color: "#52D408"});
        for (var i = 0 ; i < idEdges.length; i++) {
           data.edges.update({id: idEdges[i], color: "blue"});
        }   
        for (var i=0; i<logicNetwork.length; i++) {
            if(logicNetwork[i].id == idNode) {
                logicNetwork[i].initial = true;
                break;
            }
        } 
    }
};

var setFinalState = function(){
    if(idNode != undefined){
        data.nodes.update({id: idNode, final: true, color: "#FAE409"});
        for (var i = 0 ; i <= idEdges.length; i++) {
           data.edges.update({id: idEdges[i], color: "blue"});
        }
        for (var i=0; i<logicNetwork.length; i++) {
            if(logicNetwork[i].id == idNode) {
                logicNetwork[i].final = true;
                break;
            }
       }    
    }
};

var clearAllStates = function() {
    for(var i=0; i<logicNetwork.length; i++) {
        logicNetwork[i].initial = false;
        logicNetwork[i].final = false;
        data.nodes.update({id: i+1, visited: false, initial: false, final: false, color:"#99ccff"});
    }
    solucionFinal = [];
    clearAllVisites();
}

var clearAllVisites = function() {
    for(var i=0; i<logicNetwork.length; i++) {
        logicNetwork[i].visited = false;
        data.nodes.update({id: i+1, visited: false});
    }
}


var saveText = function(text, filename){
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click();
};

var saveGraphJSON = function(){
    saveText(JSON.stringify(data), "filename.json" );
};

var handleFileSelect = function(evt,callback) {

    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onloadend = (function (theFile) {
            return function (e) {
                    try {

                        callback(e.target.result);
                       
                    } catch (ex) {
                        alert('ex when trying to parse json = ' + ex);
                    }
            }
        })(f);

        reader.readAsText(f);
    }
};

var loadGraphJSON = function(evt){
    handleFileSelect(evt,function(result){

        json = JSON.parse(result);

        var arr = Object.values(json.nodes._data);
        var arr2 = Object.values(json.edges._data);

        var nodos = new vis.DataSet(arr);
        var arcos = new vis.DataSet(arr2);
        data = {
            nodes: nodos,
            edges: arcos
        };

        network = new vis.Network(container, data, options);
        console.log(network);
        network.on("select", function (params) {
            idNode = params.nodes[0];
            idEdges = params.edges;
        });
        updateLogicNetworkOnNew(arr, arr2); 
        console.log(logicNetwork);
    });
};

var updateLogicNetworkOnNew = function(nodes, edges) {
    logicNetwork = [];
    for(var i=0; i<nodes.length; i++) {
        var listaEdges = [];
        for(var j=0; j<edges.length; j++) {
            if(nodes[i].id == edges[j].from) {
                listaEdges.push({to: edges[j].to, weigth: parseInt(edges[j].label)});
            }
        }
        var node = {
            id: i+1,
            name: nodes[i].label,
            visited: false,
            final: nodes[i].final,
            initial: nodes[i].initial,
            edges: listaEdges
        };
        logicNetwork.push(node);
    }
};

var deleteNode = function(id) {
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].id == id) {
            logicNetwork.splice(i,1);
        }
    }
    for(var i=0; i<logicNetwork.length; i++) {
        for(var j=0; j<logicNetwork[i].edges.length; j++) {
            if(logicNetwork[i].edges[j].to == id) {
                logicNetwork[i].edges.splice(j,1);
            }
        }
    }
};

var DFS = function(graph, node1, goal) {
    var stack = [];
    var closeStack = [];
    var node;
    var succes = "Fracaso";
    var size = 0;
    stack.push(node1);
    while(stack.length > 0) {
        node = stack.pop();
        closeStack.push(node);
        console.log("->" + node.name);
        if(node.id == goal.id){
            succes = "Exito";
            break;
        }
        for(var i=0; i<graph.length; i++){
            if(getEdgeTest(node, graph[i], closeStack)){
                stack.push(graph[i]);
            }
        }
    }
    size = sizeof(stack) + sizeof(closeStack) + sizeof(node);
    console.log("Size: " + size);
    console.log(succes);
    result = true;
};

var DLS = function(graph, node1, goal, limit) {
    var stack = [];
    var depth_stack = [];
    var closeStack = [];
    var node;
    var depth;
    var size = 0;
    stack.push(node1);
    depth_stack.push(0);
    while(stack.length > 0) {
        depth = depth_stack.pop();
        node = stack.pop();
        closeStack.push(node);
        console.log("->" + node.name);
        //console.log("Depth: " + depth);
        //console.log(closeStack);
        if(node.id == goal.id){
            size = sizeof(stack) + sizeof(depth_stack) + sizeof(closeStack) + sizeof(node) + sizeof(depth);
            console.log("Size: " + size);
            return true;
        }
        if(depth < limit) {
            for(var i=0; i<graph.length; i++){
                if(getEdgeTest(node, graph[i], closeStack)){
                    stack.push(graph[i]);
                    depth_stack.push(depth+1);
                }
            }
        }
    }
    return false;
};

var avoidCycle = function(node, list) {
    for(var i=0; i<list.length; i++) {
        if(list[i].id == node.to){
            return false;
        }
    }
    return true;
};

var getEdgeTest = function(node, to, closeList) {
    for(var i=0; i<node.edges.length; i++) {
        if(node.edges[i].to == to.id && avoidCycle(node.edges[i], closeList)){
            return true;
        }
    }
    return false;
};

var BFS = function(graph, node1, goal) {
    var queue = [];
    var closeStack = [];
    var node, size;
    var succes = "Fracaso";
    queue.push(node1);
    while(queue.length > 0) {
        node = queue.shift();
        closeStack.push(node);
        console.log("->" + node.name);
        if(node.id == goal.id){
            succes = "Exito";
            break;
        }
        for(var i=0; i<graph.length; i++){
            if(getEdgeTest(node, graph[i], closeStack)){
                queue.push(graph[i]);
            }
        }
    }
    size = sizeof(queue) + sizeof(closeStack) + sizeof(node);
    console.log("Size: " + size);
    console.log(succes);
};

var UCS = function(graph, node1, goal) {
    var queue = [];
    var closeStack = [];
    var node, cost, child_cost, size;
    var succes = "Fracaso";
    queue.push(node1);
    queue.push(0);
    while(queue.length > 0) {
        cost = queue.pop();
        node = queue.pop();
        closeStack.push(node);
        console.log("-> " + node.name);
        if(node.id == goal.id){
            console.log("Cost: " + cost);
            succes = "Exito";
            break;
        }
        else {
            for(var i=0; i<graph.length; i++){
                if(node.id != graph[i].id && avoidCycle(graph[i], closeStack)){
                    if(graph[i].id != node1.id ){
                        child_cost = getEdgeCost(node, graph[i], closeStack);
                        if(child_cost){
                            queue.push(graph[i]);
                            queue.push(child_cost+cost);
                            queue = sort(queue);
                        }
                    }   
                }
            }
        }
    }
    size = sizeof(queue) + sizeof(closeStack) + sizeof(cost) + sizeof(node);
    console.log("Size: " + size);
    console.log(succes);
};

var change = function(list, indexOne, indexTwo, indexThree,indexFour){
    var tmpVal = list[indexOne];
    var tmpVal2 = list[indexTwo];
    list[indexOne] = list[indexThree];
    list[indexTwo] = list[indexFour];
    list[indexThree] = tmpVal;
    list[indexFour] = tmpVal2;
    return list;
};

var sort = function(list){
    var size = list.length;
    var band = false;
    for(pass = 3; pass < size; pass+=2){ // outer loop
        for(left = 1; left <= (size - pass); left+=2){ // inner loop
            var right = left + 2;
            if( list[left] < list[right] ){
                list = change(list, left-1, left, right-1, right);
            }
        }
    }
    return list;
};

var SA = function(graph, node1, goal){
    var temp = 100000;
    var coolingRate = 0.003;
    var size = 0;
    findSolution(graph,node1,goal);
    if(solutionFinal.length == 0){
        console.log("Failure, no route");
    }
    else if(solutionFinal[solutionFinal.length-1].id != goal.id){
        console.log("Failure, no route");
    }
    else{
        var currentSolution = solutionFinal.slice();
        var bandera;
        var bestSolution = currentSolution.slice();         // Asumme is the best solution

        /*console.log("FIRST");
        for (var i = 0; i < currentSolution.length; i++) {
            console.log(currentSolution[i].name);
        }*/
        while(temp > 1){                            // Loop until system has cooled
            var newSolution = currentSolution.slice();

            newSolution = createNeighbour(newSolution);

            /*console.log("NEW");
            for (var i = 0; i < newSolution.length; i++) {
                console.log(newSolution[i].name);
            }*/

            bandera = checkRoad(newSolution);
            var max = Fact(newSolution.length-2)/(2*(Fact(newSolution.length-4)));
            var iterations = 0;

            while(bandera == false && max > iterations){
               newSolution = createNeighbour(newSolution);
               bandera = checkRoad(newSolution);
               iterations += 1;
            }
            var currentSolutionCost = getTotalCost(currentSolution);

            if(bandera == true){
                var newSolutionCost = getTotalCost(newSolution);
                var bestSolutionCost = getTotalCost(bestSolution);

                var rand =  Math.random() * (1.0 - 0.0) + 0.0;
                if(acceptanceProbability(currentSolutionCost,newSolutionCost, temp) > rand){
                    currentSolution = newSolution;
                }
                if(currentSolutionCost < bestSolutionCost){
                    bestSolution = currentSolution;
                }
            }
            temp *= 1 - coolingRate;

        }
        //if (bandera == true || bandera == false && max == iterations){
            console.log("Success!");
            console.log("Best Solution Cost: " + bestSolutionCost);
            console.log("Best Solution: " );
            for (var i = 0; i < bestSolution.length; i++) {

                if(bestSolution[i].name != undefined){
                    console.log(bestSolution[i].name);
                }
            }
            size = sizeof(currentSolution) + sizeof(bestSolution) + sizeof(newSolution) + sizeof(bestSolutionCost) + sizeof(currentSolutionCost) + sizeof(newSolutionCost);
            console.log("Size: " + size);
       // }
    }
}

var BIDI = function(graph, node1, goal) {
    var queue1 = [];
    var queue2 = [];
    var caminoA = [];
    var caminoB = [];
    var nodeA;
    var nodeB;
    var conta = 0;
    var succes = "Fracaso";
    var size = 0;
    queue1.push(node1);
    queue2.push(goal);
    while(queue1.length > 0 && queue2.length > 0) {
        if (queue1[0].id == queue2[0].id){
            succes = "Exito";
            break;
        }
        nodeA = queue1.shift();
        nodeB = queue2.shift();
        
        caminoA.push(nodeA.name);
        caminoB.unshift(nodeB.name);
        if(nodeA.id == nodeB.id){
            succes = "Exito";
            break;
        }
        if(nodeA.visited == false && nodeB.visited == false) {
            for(var i=graph.length-1; i>0; i--) {
                if(getEdge(nodeA, graph[i]))
                    queue1.push(graph[i]);
                if(getEdge(nodeB, graph[i]))
                    queue2.push(graph[i]);
            }
        }
        nodeA.visited = true;
        nodeB.visited = true;
    }
    caminoA = caminoA.concat(caminoB);
    for (var i = 0; i<caminoA.length; i++){
        console.log("->"+caminoA[i]);
    }
    size = sizeof(queue1) + sizeof(queue2) + sizeof(caminoA) + sizeof(caminoB) + sizeof(nodeA) + sizeof(nodeB) + sizeof(conta);
    console.log("Size: " + size);
    console.log(succes);
};

var Fact = function(num){
    if (num === 0)
        return 1;
    else
        return num * Fact( num - 1 ); 
};

var BestFS = function(graph, node1, goal){
        var closeList = [];
        var openList = [];
        var cost;
        var size;
        openList.push(node1);
        openList.push(0);
        while(openList.length>0){

            cost = openList.pop();
            node = openList.pop();
            console.log("Node: " + node.name);
            if(node.id == goal.id){
                size = sizeof(node);
                console.log("Logro Logrado");
                break;
            }
            else{
                closeList.push(node);
                for (i = graph.length-1; i > 0 ; i--) {      
                     if(getEdge(node, graph[i]) && graph[i].id != node.id && avoidCycle(graph[i], closeList)){
                         
                        cost = getEdgeCost(node, graph[i], closeList);
                        
                        if(cost){
                            console.log(graph[i].name + " - " + cost);
                            openList.push(graph[i]);
                            openList.push(cost);    
                        }
                        
                     }
                        
                    
                }
                openList = sort(openList);
            }

        }
        size = size + sizeof(closeList) + sizeof(openList) + sizeof(cost);
        console.log("Size: " + size);
    };

var Astar = function(graph, node1, goal){
    var closeList = [];
    var openList = [];
    var cost;
    var size;
    var cost2;
    openList.push(node1);
    openList.push(0);
    while(openList.length>0){

        cost = openList.pop();
        node = openList.pop();
        console.log("Node: " + node.name);
        if(node.id == goal.id){
            size = size + sizeof(node);
            console.log("Logro Logrado");
            return;
        }
        else{
            closeList.push(node);
            for (i = graph.length-1; i > 0 ; i--) {      
                    if(getEdge(node, graph[i]) && graph[i].id != node.id && avoidCycle(graph[i], closeList)){
                    cost2 = cost;
                    cost = getEdgeCost(node, graph[i], closeList);
                    if(cost){
                        console.log(graph[i].name + " - " + cost);
                        openList.push(graph[i]);
                        openList.push(cost + cost2);    
                    }
                    }
                    
                    
            }
            size = size + sizeof(cost2);
            openList = sort(openList);
        }

    }
    size = size + sizeof(closeList) + sizeof(openList) + sizeof(cost);
    console.log("Size: " + size);
};

var HillClimbing = function(graph, node1, goal){
    var closeList = [];
    var openList = [];
    var cost;
    var size = 0;
    openList.push(node1);
    openList.push(0);
    while(openList.length>0){

        cost = openList.pop();
        node = openList.pop();

        while(openList.length>0){
            openList.pop();
            nodeToClose = openList.pop();
            closeList.push(nodeToClose);
        }

        console.log("Node: " + node.name);
        if(node.id == goal.id){
            size = size + sizeof(node);
            console.log("Logro Logrado");
            break;
        }
        else{
            closeList.push(node);
            for (i = graph.length-1; i > 0 ; i--) {      
                if(getEdge(node, graph[i]) && graph[i].id != node.id && avoidCycle(graph[i], closeList)){
                    cost = getEdgeCost(node, graph[i], closeList);
                    if(cost){
                        console.log(graph[i].name + " - " + cost); 
                        openList.push(graph[i]);
                        openList.push(cost);    
                    }
                }
            }
            openList = sort(openList);
        }

    }
    size = size + sizeof(closeList) + sizeof(openList) + sizeof(cost);
    console.log("Size: " + size);
};

var createNeighbour = function(solution){

    var pos1 = randomNumber(solution.length-2,1);
    var pos2;
    var x = pos1 + 1;
    var y = pos1 - 1;


    if (x==solution.length-1){
        pos2 = pos1;
        pos1 -= 1;
    }
    else{
        pos2 = pos1 + 1;
    }

    
    var temp = solution[pos1];
    solution[pos1] = solution[pos2];
    solution[pos2] = temp;
    return solution;

};

var checkRoad = function(solution){
    for (var i = 1; i < solution.length; i++) {
        if(getEdge(solution[i-1],solution[i]) == false){
            return false;
        }
    }
    return true
};

var acceptanceProbability = function(currentCost, newCost, temperature){
    if(newCost < currentCost){
        return 1.0;
    }
    else{
        return Math.exp((currentCost - newCost) / temperature);
    }
};


var getTotalCost = function(solution){
    var totalCost = 0;
    for (var i = 1; i < solution.length; i++) {
        var cost = getEdgeCost2(solution[i-1],solution[i]);
        if (cost){
            totalCost += cost;
        }
    }
    return totalCost;
};

var getEdge = function(node, to) {
    for(var i=0; i<node.edges.length; i++) {
        if(node.edges[i].to == to.id){
            return true;
        }
    }
    return false;
};

var getEdgeCost = function(node, to, closeList) {
    var cost;
    for(var i=0; i<node.edges.length; i++) {
        if(node.edges[i].to == to.id && avoidCycle(node.edges[i], closeList)){
            cost = node.edges[i].weigth;
            break;
        }
    }
    return cost;
};

var getEdgeCost2 = function(node, to, closeList) {
    var cost = 9999;
    for(var i=0; i<node.edges.length; i++) {
        if(node.edges[i].to == to.id){
            cost = node.edges[i].weigth;
            break;
        }
    }
    return cost;
};


var findSolution = function(graph,node1,goal){
   
    node1.visited = true;
    var ant = node1;
    if(node1.id == goal.id){
        solutionFinal.push(goal);
        return;
    }
    if(goal.visited == true){
        return;
    }
    if(node1.edges.length==0){
        return;
    }
    else{
        //console.log(node1.name);
        var t = node1.edges.length;
        solutionFinal.push(node1);
            for (var i = 0; i < t; i++) {
                for (var j = 0; j < logicNetwork.length; j++) {
                    if(node1.edges[i].to == logicNetwork[j].id){
                        if(!logicNetwork[j].visited){
                            findSolution(logicNetwork,logicNetwork[j],goal);
                        }
                    }
                }
            }
    }
};

var getNodesById = function(nodes){
    var arr = [];
    for (var i = 0; i < nodes.length; i++) {
        for (var j = 0; j < logicNetwork.length; j++) {
            if(nodes[i] == logicNetwork[j].id){
                arr.splice(i, 0, logicNetwork[j]);
                break;
            }
        }
    }
    return arr;
};

var tabuList = [];
var TABU = function(graph, node1, goal){
    var maximum_criteria = 100;
    var contador = 0;
    findSolution(graph,node1,goal);
    if(solutionFinal.length == 0){
        console.log("Failure, no route");
    }
    else if(solutionFinal[solutionFinal.length-1].id != goal.id){
        console.log("Failure, no route");
    }
    else{ 
        var currentSolution = solutionFinal.slice();

        var bestSolution = currentSolution.slice();         // Asumme is the best solution

        //var newSolution = currentSolution.slice();

        while(maximum_criteria > contador){                            // Loop until system has cooled
            
            var newSolution = findBestNeighboar(solutionFinal);
            //tabuList = [];

            var newSolutionCost = getTotalCost(newSolution);
            var bestSolutionCost = getTotalCost(bestSolution);


            if(newSolutionCost < bestSolutionCost){
                bestSolution = newSolution;
            }


            contador += 1;
        }

        console.log("Success!");
        console.log("Best Solution Cost: " + bestSolutionCost);
        console.log("Best Solution: " );
        for (var i = 0; i < bestSolution.length; i++) {
            if(bestSolution[i].name != undefined){
                console.log(bestSolution[i].name);
            }
        }
        size = sizeof(currentSolution) + sizeof(bestSolution) + sizeof(newSolution) + sizeof(bestSolutionCost)  + sizeof(newSolutionCost);
        console.log("Size: " + size);
    }
}

var createNeighbourTabu = function(solution){

    var pos1 = randomNumber(solution.length-2,1);
    var pos2;
    var x = pos1 + 1;
    var y = pos1 - 1;
    var bandera = false;

    if (x==solution.length-1){
        pos2 = pos1;
        pos1 -= 1;
    }
    else{
        pos2 = pos1 + 1;
    }
    var temporal = [pos1,pos2];


    if(tabuList.length == 0){
        var temp = solution[pos1];
        solution[pos1] = solution[pos2];
        solution[pos2] = temp;
        var tupla = [pos1,pos2];
        tabuList.push(tupla);
    }
    else{
        for (var i = 0; i < tabuList.length; i++) {
            if((tabuList[i][0] == temporal[0]) && (tabuList[i][1] == temporal[1])){
                bandera = true;
            } 
        }
        if(bandera == false){
             var temp = solution[pos1];
            solution[pos1] = solution[pos2];
            solution[pos2] = temp;
            var tupla = [pos1,pos2];
            if(tabuList.length == 10){
                tabuList.shift();
            }
            tabuList.push(tupla);
        }    
    }

    return solution;

};

var findBestNeighboar = function(solution){
    var max = Fact(solution.length-2)/(2*(Fact(solution.length-4)));
    var conta = 0;
    //var bandera;
    var lista = [];
    var best = solution.slice();
    //var newSolution = undefined;
    var firstSolution = solution.slice();
 
    while(max>conta){

        var newSolution = createNeighbourTabu(firstSolution);

        var bandera = checkRoad(newSolution);
        
        if (bandera == true){
            /*console.log("BUENA");
            for (var i = 0; i < newSolution.length; i++) {
                console.log(newSolution[i].name);
            }*/
            lista.push(newSolution);
        }
        else{
            /*console.log("MALA");
            for (var i = 0; i < newSolution.length; i++) {
                console.log(newSolution[i].name);
            }*/
        }

        conta += 1;
    }

    if(lista.length > 0){
        for (var i = 0; i < lista.length; i++) {
            if(getTotalCost(lista[i]) < getTotalCost(best)){
                best = lista[i];
                //console.log(lista);
            }
        }
 
        return best
    }
    else{

        return solution;
    }
    
};

var callDFS = function(){
    startTime = new Date().getTime();
    console.log("\n-------\n");
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].initial){
            for(var j=0; j<logicNetwork.length; j++) {
                if(logicNetwork[j].final) {
                    DFS(logicNetwork, logicNetwork[i], logicNetwork[j]);
                    clearAllVisites();
                }
            }
        }
    }
    endTime = new Date().getTime();
    timeElapsed = endTime - startTime;
    console.log("Time: " + timeElapsed/1000 + " seconds");
};

var callDLS = function(){
    startTime = new Date().getTime();
    console.log("\n-------\n");
    var limit = document.getElementById("limit").value;
    if(limit){
        for(var i=0; i<logicNetwork.length; i++) {
            if(logicNetwork[i].initial) {
                for(var j=0; j<logicNetwork.length; j++) {
                    if(logicNetwork[j].final){
                        if(DLS(logicNetwork, logicNetwork[i], logicNetwork[j], parseInt(limit))){
                            console.log("Exito");
                        }
                        else{
                            console.log("Fracaso");
                        }
                        clearAllVisites();
                    }
                }
            }
        }
        endTime = new Date().getTime();
        timeElapsed = endTime - startTime;
        console.log("Time: " + timeElapsed/1000 + " seconds");
    }
};

var callIDS = function(){
    startTime = new Date().getTime(); 
    console.log("\n-------\n");
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].initial) {
            for(var j=0; j<logicNetwork.length; j++) {
                if(logicNetwork[j].final) {
                    var depth = 1;
                    var status = false;
                    while(true){
                        console.log("\n\n Again");
                        status = DLS(logicNetwork, logicNetwork[i], logicNetwork[j], depth);
                        clearAllVisites();
                        if(status == true || depth == logicNetwork.length)
                            break;
                        depth+=1;
                    }
                    if(status){
                        console.log("Exito");
                    }
                    else{
                        console.log("Fracaso");
                    }
                }
            }
        }
    }
    endTime = new Date().getTime();
    timeElapsed = endTime - startTime;
    console.log("Time: " + timeElapsed/1000 + " seconds");
};

var callBFS = function(){
    startTime = new Date().getTime(); 
    console.log("\n-------\n");
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].initial) {
            for(var j=0; j<logicNetwork.length; j++) {
                if(logicNetwork[j].final) {
                    BFS(logicNetwork, logicNetwork[i], logicNetwork[j]);
                    clearAllVisites();
                }
            }
        }
    }
    endTime = new Date().getTime();
    timeElapsed = endTime - startTime;
    console.log("Time: " + timeElapsed/1000 + " seconds");
};

var callUCS = function(){
    startTime = new Date().getTime(); 
    console.log("\n-------\n");
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].initial) {
            for(var j=0; j<logicNetwork.length; j++) {
                if(logicNetwork[j].final) {
                    UCS(logicNetwork, logicNetwork[i], logicNetwork[j]);
                    clearAllVisites();
                }
            }
        }
    }
    endTime = new Date().getTime();
    timeElapsed = endTime - startTime;
    console.log("Time: " + timeElapsed/1000 + " seconds");
};

var callSA = function(){
    startTime = new Date().getTime();
    console.log("\n-------\n");
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].initial) {
            for(var j=0; j<logicNetwork.length; j++) {
                if(logicNetwork[j].final) {
                    SA(logicNetwork, logicNetwork[i], logicNetwork[j]);
                    clearAllVisites();
                }
            }
        }
    }
    endTime = new Date().getTime();
    timeElapsed = endTime - startTime;
    console.log("Time: " + timeElapsed/1000 + " seconds");
};

var callBI = function(){
    startTime = new Date().getTime();
     console.log("\n-------\n");
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].initial) {
            for(var j=0; j<logicNetwork.length; j++) {
                if(logicNetwork[j].final) {
                    BIDI(logicNetwork, logicNetwork[i], logicNetwork[j]);
                    clearAllVisites();
                }
            }
        }
    }

    endTime = new Date().getTime();
    timeElapsed = endTime - startTime;
    console.log("Time: " + timeElapsed/1000 + " seconds");
};

var callTABU = function(){
    startTime = new Date().getTime();
    console.log("\n-------\n");
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].initial) {
            for(var j=0; j<logicNetwork.length; j++) {
                if(logicNetwork[j].final) {
                    TABU(logicNetwork, logicNetwork[i], logicNetwork[j]);
                    clearAllVisites();
                }
            }
        }
    }
    endTime = new Date().getTime();
    timeElapsed = endTime - startTime;
    console.log("Time: " + timeElapsed/1000 + " seconds");
};

var callBestFS = function(){
    startTime = new Date().getTime();
    console.log("\n-------\n");
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].initial) {
            for(var j=0; j<logicNetwork.length; j++) {
                if(logicNetwork[j].final) {
                    BestFS(logicNetwork, logicNetwork[i], logicNetwork[j]);
                    clearAllVisites();
                }
            }
        }
    }
    endTime = new Date().getTime();
    timeElapsed = endTime - startTime;
    console.log("Time: " + timeElapsed/1000 + " seconds");
};

var callAstar = function(){
    startTime = new Date().getTime();
    console.log("\n-------\n");
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].initial) {
            for(var j=0; j<logicNetwork.length; j++) {
                if(logicNetwork[j].final) {
                    Astar(logicNetwork, logicNetwork[i], logicNetwork[j]);
                    clearAllVisites();
                }
            }
        }
    }
    endTime = new Date().getTime();
    timeElapsed = endTime - startTime;
    console.log("Time: " + timeElapsed/1000 + " seconds");
};

var callHillClimbing = function(){
    startTime = new Date().getTime();
    console.log("\n-------\n");
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].initial) {
            for(var j=0; j<logicNetwork.length; j++) {
                if(logicNetwork[j].final) {
                    HillClimbing(logicNetwork, logicNetwork[i], logicNetwork[j]);
                    clearAllVisites();
                }
            }
        }
    }
    endTime = new Date().getTime();
    timeElapsed = endTime - startTime;
    console.log("Time: " + timeElapsed/1000 + " seconds");
};

var search = function(value) {
    if(value=="DFS"){
        callDFS();
    }
    else if(value=="DLS"){
        callDLS();
    }
    else if(value=="IDS"){
        callIDS();
    }
    else if(value=="BFS"){
        callBFS();
    }
    else if(value=="BIDI"){
        callBI();
    }
    else if(value=="UCS"){
        callUCS();
    }
    else if(value=="SA"){
        callSA();
    }
    else if(value=="TABU"){
        callTABU();
    }
    else if(value=="BestFS"){
        callBestFS();
    }
    else if(value=="Astar"){
        callAstar();
    }
    else if(value=="HillClimbing")
        callHillClimbing();
};

var grafo = function(value) {
    if(value=="initial")
        setInitialState();
    else if(value=="final")
        setFinalState();
    else if(value="clearAll")
        clearAllStates();
    else
        clearAllVisites();
};

document.getElementById('files').addEventListener('change', loadGraphJSON, false);
auto_graph(0);
setStates();
