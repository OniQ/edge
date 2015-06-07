/**
 * Created by OniQ on 04/05/15.
 */
var edgeEditor = new edgeEditor();

function edgeEditor(){

    this.processKeyDown = function(ev){
        if (edge.keysDisabled)
            return;
        switch(ev.keyCode){
            case KEYCODES['w']:
            {
                edge.cy += edge.camSpeed;
                break;
            }
            case KEYCODES['d']:
            {
                edge.cx -= edge.camSpeed;
                break;
            }
            case KEYCODES['s']:
            {
                edge.cy -= edge.camSpeed;
                break;
            }
            case KEYCODES['a']:
            {
                edge.cx += edge.camSpeed;
                break;
            }
            case KEYCODES['1']:
            {
                edge.camSpeed--;
                break;
            }
            case KEYCODES['2']:
            {
                edge.camSpeed++;
                break;
            }
        }
    };

    this.run = function(){

    }
}