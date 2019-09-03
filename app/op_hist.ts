import { EventData, fromObject } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
var Sqlite = require( "nativescript-sqlite" );


class Operation
{
    timestamp : String
    expression : String
    result : String
}


export function navigatingTo(args: EventData) {

    const page = <Page>args.object
  
    var resultSet : any
    var operation : Operation
    var operations : Operation[] = []

    var db_fetch = new Sqlite( "calculator.db", function( err , db ) {

        if( err )
        {
            console.log("Database could not be opened");
        }
        else
        {
            db.all( "select * from OPERATIONS order by timestamp desc" , function( err , rs ){
    
                if( err )
                {
                    console.log("Data could not be retreived");
                }
                else
                {
                    console.log("Retreived successfully \n");
                    resultSet = rs;
                }
    
            });
        }
    });

    

    for (var index in resultSet)
    {
        operation = new Operation()
        operation.timestamp = resultSet[index][0]
        operation.expression = resultSet[index][1]
        operation.result = resultSet[index][2]
        operations[index] = operation
        
    }

    page.bindingContext = fromObject( { items : operations } )

}




export function database_insert( time : string , op : string , res : string )
{

    var db_insert = new Sqlite( "calculator.db", function( err , db ) {

        db.execSQL( "insert into OPERATIONS ( timestamp , operation , result ) values ( ? , ? , ? )", [ time , op , res ] , function( err , id ){

            if( err )
            {
                console.log("Entry could not be done");
            }
            else
            {
                console.log("Entry done successfully",id);
            }

        }  );

    });

} 




     




  

