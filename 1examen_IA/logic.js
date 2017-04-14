// create an array with nodes
var abc = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","ñ","o","p","q","r","s","t","u","v","w","x","y","z"];
var idNode = undefined;
var idEdges = [];
var data = {};
var network = undefined;
var container = undefined;
var options = undefined;
var logicNetwork = [];
var json;

var auto_graph = function(number){
    var listaNodes = [];
    var listaEdges = [];
    var n = randomNumber(number,1);
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
    
    options = {layout: {improvedLayout: false}};
    // initialize your network!
    network = new vis.Network(container, data, options);

    network.on("selectNode", function (params) {
        idNode = params.nodes[0];
        idEdges = params.edges;
    }); 
};

var randomNumber = function(n1,n2){
    return Math.floor(Math.random()*n1)+n2;
};

auto_graph(10);

var deleteNode = function(){
    if(idNode != undefined){
        data.nodes.remove({id: idNode});
        updateLogicNetwork(idNode);
        idNode = undefined;
    }
};

var updateLogicNetwork = function(id) {
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].id == id) {
            logicNetwork.splice(i, 1);
        }
        else{
            for(var j=0; j<logicNetwork[i].edges.length; j++) {
                if(logicNetwork[i].edges[j].to == id) {
                    logicNetwork[i].edges.splice(j, 1);
                }
            }
        }
    }
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
        data.nodes.update({id: i+1, initial: false, final: false, color:"#99ccff"});
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

function handleFileSelect(evt,callback) {

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

function loadGraphJSON(evt){
    handleFileSelect(evt,function(result){

        json = JSON.parse(result);

        var arr = Object.values(json.nodes._data);
        var arr2 = Object.values(json.edges._data);
        
        var nodos = new vis.DataSet(arr);
        var arcos = new vis.DataSet(arr2);
        var data2 = {
            nodes: nodos,
            edges: arcos
        };

        network = new vis.Network(container, data2, options);

        network.redraw();
    });
};

var DFS = function(graph, node1, goal) {
    var stack = [];
    var node;
    var succes = "Fracaso";
    stack.push(node1);
    while(stack.length > 0) {
        node = stack.pop();
        console.log("->" + node.name);
        if(node.id == goal.id){
            succes = "Exito";
            break;
        }
        if(node.visited == false) {
            for(var i=graph.length-1; i>0; i--) {
                if(getEdge(node, graph[i]))
                    stack.push(graph[i]);
            }
        }
        node.visited = true;
    }
    console.log(succes);
};

var DLS = function(graph, node1, goal, limit) {
    var stack = [];
    var depth_stack = [];
    var node;
    var depth;
    var succes = "Fracaso";
    stack.push(node1);
    depth_stack.push(0);
    while(stack.length > 0) {
        node = stack.pop();
        depth = depth_stack.pop();
        console.log("->" + node.name);
        console.log("Depth: " + depth);
        if(node.id == goal.id){
            succes = "Exito";
            break;
        }
        if(depth < limit) {
            if(node.visited == false) {
                for(var i=graph.length-1; i>0; i--) {
                    if(getEdge(node, graph[i]))
                        stack.push(graph[i]);
                        depth_stack.push(depth+1);
                }
            }
            node.visited = true;
        }
    }
    console.log(succes);
};

var getEdge = function(node, to) {
    for(var i=0; i<node.edges.length; i++) {
        if(node.edges[i].to == to.id){
            return true;
        }
    }
    return false;
};


var callDFS = function(){
    var start;
    var goal;
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].initial){
            start = logicNetwork[i];
        }
        else if(logicNetwork[i].final){
            goal = logicNetwork[i];
        }
    }
    DFS(logicNetwork, start, goal);
};

var callDLS = function(){
    var start;
    var goal;
    for(var i=0; i<logicNetwork.length; i++) {
        if(logicNetwork[i].initial){
            start = logicNetwork[i];
        }
        else if(logicNetwork[i].final){
            goal = logicNetwork[i];
        }
    }
    var limit = document.getElementById("limit").value;
    if(limit != undefined)
        DLS(logicNetwork, start, goal, parseInt(limit));
};

document.getElementById('files').addEventListener('change', loadGraphJSON, false);

