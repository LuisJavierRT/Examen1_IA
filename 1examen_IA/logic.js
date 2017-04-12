// create an array with nodes
    var abc = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","ñ","o","p","q","r","s","t","u","v","w","x","y","z"];
    var idNode = undefined;
    var idEdges = [];
    var data = {};
    var auto_graph = function(number){
        var listaNodes = [];
        var listaEdges = [];
        var n = randomNumber(number,1);
        for (var i = 1; i <= n; i++) {
            var node = {
                id: i,
                label: abc[i-1],
                initial: false,
                final: false
            };
            listaNodes.push(node);
        }
        var nodes = new vis.DataSet(listaNodes);
        

        for (var i = 1; i <= n; i++) {
            var m = randomNumber(n,0);
            for (var j = 1; j<= m; j++) {
                var x = randomNumber(n,1);
                var val = randomNumber(10,1);
                var edge = {
                    from: i,
                    to: x,
                    label: val,
                    color: "blue"
                    
                };
                listaEdges.push(edge);
            }
        }
        var edges = new vis.DataSet(listaEdges);
        console.log(edges);
        // create a network
        var container = document.getElementById('mynetwork');

        // provide the data in the vis format
         data = {
            nodes: nodes,
            edges: edges
        };
        
        var options = {};
        // initialize your network!
        var network = new vis.Network(container, data, options);
        
        network.on("selectNode", function (params) {
            idNode = params.nodes[0];
            idEdges = params.edges;
        });
    };

    var randomNumber = function(n1,n2){
        return Math.floor(Math.random()*n1)+n2;
    };

    var deleteNode = function(){
        if(idNode != undefined){
            data.nodes.remove({id: idNode});
            idNode = undefined;
        }
    };

    var setInitialState = function(){
        if(idNode != undefined){
           data.nodes.update({id: idNode, initial: true, color: "#52D408"});
           for (var i = 0 ; i <= idEdges.length; i++) {
               data.edges.update({id: idEdges[i], color: "blue"});
           }
           idNode = undefined;   
        }
    };

    var setFinalState = function(){
        if(idNode != undefined){
            data.nodes.update({id: idNode, final: true, color: "#FAE409"});
            for (var i = 0 ; i <= idEdges.length; i++) {
               data.edges.update({id: idEdges[i], color: "blue"});
           }
            idNode = undefined;     
        }
    };

    auto_graph(8);
