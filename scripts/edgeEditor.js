/**
 * Created by OniQ on 04/05/15.
 */
var edgeEditor = new edgeEditor();

function edgeEditor(){

    this.processKeyDown = function(ev){
        switch(ev.keyCode){
            case KEYCODES['3']:
            {
                console.log('editor key pressed');
                break;
            }
        }
    };

    this.run = function(){

    }
}