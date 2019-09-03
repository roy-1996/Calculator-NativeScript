

import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { View } from "tns-core-modules/ui/core/view";
import { Calculator } from "./main-view-model";
var Sqlite = require( "nativescript-sqlite" );
//import * as application from "tns-core-modules/application";
import {screen, isIOS} from "tns-core-modules/platform";
//import {OrientationChangedEventData} from "tns-core-modules/application";



var page_height = 0

var db_create = new Sqlite( "calculator.db" , function( err , db ) {

    if( err )
    {
        console.log("Database could not be opened",err)
    }
    else
    {
        db.resultType(Sqlite.RESULTSASARRAY);
        db.execSQL("create table if not exists OPERATIONS ( timestamp text, operation text, result text )", function( err ) 
        {
            if( err )
            {
                console.log("Table could not be created",err);
            }
            else
            {
                console.log("Table created successfully");
            }
        });
    }

});

function checkIfViewRendered( page : Page )
{
    var promise = new Promise((resolve,reject) => {

        setTimeout( () => {

            page_height = page.getActualSize().height
            console.log("Inside timeout " + page_height )

            resolve( page_height );
        } , 1000 )


    });

    return promise;
}




export function navigatingTo(args: EventData) {

   
    const page = <Page>args.object;

    var promise = checkIfViewRendered( page )
    promise.then( ( page_height : number ) => {

        const bindingContext = new Calculator();
        bindingContext.set("expression","")
        bindingContext.set("result","")
        bindingContext.set("height",page_height/1.5);
        bindingContext.set("less_height",page_height/6);
        page.bindingContext = bindingContext;
    })

    /*
    console.log( page_height )

    const bindingContext = new Calculator();
    bindingContext.set("expression","")
    bindingContext.set("result","")
    bindingContext.set("height",page_height/2);
    bindingContext.set("less_height",page_height/4);
    page.bindingContext = bindingContext;

    */

}





