const Castella = require("castella");

function Container({children, ...props} = {}){
    return <div className={'page ' + (props.className||"page--default")}>{children}</div>
}

function Page(){
    const cleverlyInterpolated = "Cleverly interpolated";
    return (<Container className="page--wrapper">
        This is some ${} text that's {cleverlyInterpolated}
    </Container>)
}

module.exports = Page;