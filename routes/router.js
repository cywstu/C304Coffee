exports.router = (app) => {
    app.get("/", (req, res) =>{
        res.send("hi");
    });
    
    app.get("/coffee", (req,res) =>{
        res.send("coffee");
    });
}