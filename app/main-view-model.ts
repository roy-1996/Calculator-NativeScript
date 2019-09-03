import { Observable, EventData } from "tns-core-modules/data/observable";
import { ActionItem } from "tns-core-modules/ui/action-bar/action-bar";
import { database_insert } from "./op_hist";
var fecha = require('fecha');
import * as dialogs from "tns-core-modules/ui/dialogs";


export class Calculator extends Observable {

    private val1 : number
    private val2 : number;
    private res : number;
    private operator_seen : boolean = false;
    private operators : string = "+-*/^";
    private values : number[] = []
    private ops : string[] = []
 
    onTap0() {

        var labelText : String = this.get("expression")
        this.set("expression",`${labelText}0`)  
        this.compute();   
    }

    onTap1() {

        var labelText : String = this.get("expression")
        this.set("expression",`${labelText}1`)  
        this.compute();      
    }

    onTap2() {

        var labelText : String = this.get("expression")
        this.set("expression",`${labelText}2`)  
        this.compute();        
    }

    onTap3() {

        var labelText : String = this.get("expression")
        this.set("expression",`${labelText}3`)  
        this.compute();        
    }

    onTap4() {

        var labelText : String = this.get("expression")
        this.set("expression",`${labelText}4`)  
        this.compute();        
    }

    onTap5() {

        var labelText : String = this.get("expression")
        this.set("expression",`${labelText}5`)   
        this.compute();       
    }

    onTap6() {

        var labelText : String = this.get("expression")
        this.set("expression",`${labelText}6`)  
        this.compute();        
    }

    onTap7() {

        var labelText : String = this.get("expression")
        this.set("expression",`${labelText}7`)  
        this.compute();        
    }

    onTap8() {

        var labelText : String = this.get("expression")
        this.set("expression",`${labelText}8`)  
        this.compute();       
    }

    onTap9() {

        var labelText : String = this.get("expression")
        this.set("expression",`${labelText}9`)   
        this.compute();       
    }

    onTapadd() {

        var labelText : String = this.get("expression")
        var last_char : string;
        
        if( labelText.length == 0 )             /* If the expression string is empty, do not add any operator */
        {
            this.set("expression","")
        }
        else 
        {
            last_char = labelText.charAt( labelText.length-1 )

            if( this.operators.indexOf( last_char ) != -1 )
            {
                this.set( "expression" , labelText )
            }
            else
            {
                this.set("expression" , labelText + "+")
                this.operator_seen = true;
            }    
        }
    }


    onTapsub() {

        var labelText : String = this.get("expression")
        var last_char : string;
        
        if( labelText.length == 0 )             /* If the expression string is empty, do not add any operator */
        {
            this.set("expression","")
        }
        else 
        {
            last_char = labelText.charAt( labelText.length-1 )

            if( this.operators.indexOf( last_char ) != -1 )
            {
                this.set( "expression" , labelText )
            }
            else
            {
                this.set("expression" , labelText + "-")
                this.operator_seen = true;
            }    
        }
    }


    onTapmul() {

        var labelText : String = this.get("expression")
        var last_char : string;
        
        if( labelText.length == 0 )             /* If the expression string is empty, do not add any operator */
        {
            this.set("expression","")
        }
        else 
        {
            last_char = labelText.charAt( labelText.length-1 )

            if( this.operators.indexOf( last_char ) != -1 )
            {
                this.set( "expression" , labelText )
            }
            else
            {
                this.set("expression" , labelText + "*")
                this.operator_seen = true;
            }    
        }
    }

    onTapdiv() {

        var labelText : String = this.get("expression")
        var last_char : string;
        
        if( labelText.length == 0 )             /* If the expression string is empty, do not add any operator */
        {
            this.set("expression","")
        }
        else 
        {
            last_char = labelText.charAt( labelText.length-1 )

            if( this.operators.indexOf( last_char ) != -1 )
            {
                this.set( "expression" , labelText )
            }
            else
            {
                this.set("expression" , labelText + "/")
                this.operator_seen = true;
            }    
        }
    }

    onTapexp() {

        var labelText : String = this.get("expression")
        var last_char : string;
        
        if( labelText.length == 0 )             /* If the expression string is empty, do not add any operator */
        {
            this.set("expression","")
        }
        else 
        {
            last_char = labelText.charAt( labelText.length-1 )

            if( this.operators.indexOf( last_char ) != -1 )
            {
                this.set( "expression" , labelText )
            }
            else
            {
                this.set("expression" , labelText + "^")
                this.operator_seen = true;
            }    
        }
    }

    onTapclr() {

        var expression : string = this.get("expression");
        var result : string = this.get("result");

        var curr_date = fecha.format( new Date() , 'DD-MM-YYYY hh:mm:ss A' )

        database_insert( curr_date , expression , result );

        this.set( "expression" , "" )
        this.set( "result" , "" ) 
        
        this.operator_seen = false;
    }

    onTaplb()
    {
        var labelText : String = this.get("expression")
        this.set("expression",`${labelText}(`)  
    }

    onTaprb()
    {
        var labelText : String = this.get("expression")
        this.set("expression",`${labelText})`)  
        this.compute()
    }

    onTapbck()
    {   
        var labelText : String = this.get("expression")
        var new_expression : String = labelText.substring(0,labelText.length-1)
        var last_char : String = new_expression[ new_expression.length - 1 ]

        if( last_char == "+" || last_char == "-" ||  last_char == "*" || last_char == "/" || last_char == "^" )
        {
            this.set("expression", new_expression )
            this.set("result","")    
        }
        else
        {
            this.set("expression", new_expression )
            this.compute()
        } 
    }

    private precedence ( op : string ) : number
    {
        if ( op == "+" || op == "-" )
        {
            return 1
        }
        if ( op == "*" || op == "/" )
        {
            return 2
        }
        if( op == "^" )
        {
            return 3
        }
        return 0
    }

    private applyOp( a : number , b : number , op : string )
    {
        switch( op )
        {
            case "+" : return a + b
            case "-" : return a - b
            case "*" : return a * b
            case "/" : if ( b )
                        {
                            return a / b
                        }
                        else
                        {
                            dialogs.alert({
                                title: "Illegal Operation",
                                message: "Division by zero",
                                okButtonText: "OK"
                            }).then(() => {
                                console.log("Dialog closed!");
                                this.set( "expression" , "" )
                                this.set( "result" , "" ) 
                                this.operator_seen = false;
                            });
                        }
            case "^" : return Math.pow(a,b)
        }
    }


    private evaluate( expression : string ) 
    {
        var i : number 
        var val : number
        var val1 : number
        var val2 : number
        var op : string

        for( i = 0 ; i < expression.length ;  )
        {
            if( expression[i] == ' ' )
            {
                continue;
            }
            else if ( expression[i] == '(' )
            {
                this.ops.push( expression[i] )
                i++
            }
            else if ( isNaN( Number( expression[i] ) ) == false )
            {
                val = 0
            
                while( i < expression.length && isNaN( Number( expression[i] ) ) == false )
                {
                    val = ( val * 10 ) +  Number( expression[i] )    
                    i++
                }
                
                this.values.push( val )

            }
            else if ( expression[i] == ')' )
            {
                while( this.ops.length > 0 && this.ops[this.ops.length-1] != "("  )
                {
                    val2 = this.values.pop()
                    val1 = this.values.pop()
                    op = this.ops.pop()
                    this.values.push( this.applyOp( val1 , val2 , op ) )
                }


                /* Pop opening brace */

                if( this.ops.length > 0 )
                {
                    this.ops.pop()
                }
                i++
            }
            else
            {
                while( this.ops.length > 0 && this.precedence( this.ops[this.ops.length-1]  ) >= this.precedence( expression[i] ) )
                {
                    val2 = this.values.pop()
                    val1 = this.values.pop()
                    op = this.ops.pop()
                    this.values.push( this.applyOp( val1 , val2 , op ) )
                }

                this.ops.push( expression[i] )
                i++
            }
        }

        while( this.ops.length > 0 )
        {
            val2 = this.values.pop()
            val1 = this.values.pop()
            op = this.ops.pop()
            this.values.push( this.applyOp( val1 , val2 , op ) )
        }

        return this.values[this.values.length-1]

    }


    private compute() : void
    {
        if ( this.operator_seen )
        {
            var expression : string = this.get("expression")
            var result = this.evaluate( expression );
            
            if( isNaN( result ) == false )
            {
                this.set("result",result)
            }
            
        }
    }

    showHistory( args : EventData )
    {
        const action_item = <ActionItem> args.object
        const first_page = action_item.page
        const first_frame = first_page.frame
        first_frame.navigate("op_hist")
    }









  
}
