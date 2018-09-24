// Arithmetic Expression Builder
// This simple program builds an arithmetic expression by creating Tokens from raw input
// The rules can be modified inside the grammar table
// The expression rules can also be modified if necesarry
// the expression itself has certain special states - valid (based on the last input type)
// and the float state based on whether the input contains an "unfinished" (a floating point operator
// had been parsed but the following arithmetic operator has not been encountered yet) floating point number

class Calculator {
    constructor() {
        this.previous = this.createToken('0'); // using operator 
        this.current = ''; 
        this.expression = {
            raw:'0', // start with zero for +/-/*/%
            float: false,
            valid: false,
            leftParenthesis: 0,
            rightParenthesis: 0
        }
    }

    createToken(rawInput) {
        let token = {value:rawInput, number:false, operator:false, parenthesis:false};
        if (['+','-','/','*','.'].includes(rawInput)) {
            token.operator = true;
        }
        if (['(', ')'].includes(rawInput)) {
            token.parenthesis = true;
        }
        if (['0','1','2','3','4','5','6','7','8','9'].includes(rawInput)) {
            token.number = true;
        }
        return token;
    }

    evaluateGrammarTable(expression, current, previous) {

        return [
            (current.value == ")" && expression.leftParenthesis <= expression.rightParenthesis), // the amount of right ")" has to match the amount of left "("
            (previous.value ==")" && current.value=="("), // cannot close and open without an operator ")("
            (previous.number && current.value == "("), // cannot have left parenthesis after number "8("
            (previous.value == ")" && current.number), // cannot have number before right parenthesis ")8"
            (previous.operator && current.operator), // cannot have two operators next to each other "/*", "++", "-/"
            (previous.value == "/" && current.value == '0'), // cannot divide by zero " x / 0"
            (expression.float && current.value == ".") // already a floating number, cannot add another .
        ];
    }

    modifyExpressionState(expression, token) {
        // first update state of the parenthesis count, if "(" expression cannot ever be valid
        if (token.value == "(") { expression.leftParenthesis++; expression.valid=false }
        if (token.value == ")") { expression.rightParenthesis++ }
        // the expression may only be valid if it ends either with a number OR a closing parenthesis
        // if the current token is ")" and triggers the parenthesis count to true, we are valid 
        if (expression.leftParenthesis == expression.rightParenthesis) { expression.valid=true }
        // the expression is valid when it ends with a number AND the count of parenthesis is equal (if there are none, then 0=0)
        if (token.number && expression.leftParenthesis == expression.rightParenthesis) { expression.valid=true } // expression ends with number
        // if an operator is present, automatically trigger valid to false, expressions cannot end with operators
        if (token.operator) { expression.valid=false } // expression ends with operator
        if (token.operator && token.value !=".") { expression.float=false } //
        if (token.operator && token.value =="." && !expression.float) { expression.float=true }

        expression.raw += token.value;
    }

    check(expression, current, previous) {
         // if even one of the grammar conditions evaluates to true - return false
        let grammarTable = this.evaluateGrammarTable(expression, current, previous);
        for (let i = 0; i< grammarTable.length; i++) {
            if (grammarTable[i] == true) { 
                return false; // do not add a new token
            }
        }
        return true; // add a new token
    }

    processInput (input) {
        this.current = this.createToken(input);
        if (this.check(this.expression, this.current, this.previous)) { // if token passes grammar rules
            this.modifyExpressionState(this.expression, this.current); // modify expression state for future grammar validation
            this.previous = this.current; // previous value necesarry for various grammar rules
        };
        console.log(this.expression.raw);
        console.log(this.expression.valid);
    }
    
}

const calc1 = new Calculator();
/*
calc1.processInput("/");
calc1.processInput("2");
calc1.processInput("-");
calc1.processInput("7");
calc1.processInput(".");
calc1.processInput("0");
calc1.processInput("+");
calc1.processInput("1");
calc1.processInput("1");
calc1.processInput(".");
calc1.processInput("1");
calc1.processInput(".");
calc1.processInput(".");
calc1.processInput("3");
calc1.processInput("/");
calc1.processInput("0");
calc1.processInput("*");
calc1.processInput("8");
calc1.processInput(".");
calc1.processInput(".");
calc1.processInput("8");
calc1.processInput("8");

*/

calc1.processInput("+");
calc1.processInput("3");
calc1.processInput("-");
calc1.processInput("(");
calc1.processInput("4");
calc1.processInput("*");
calc1.processInput("6");
calc1.processInput("+");
calc1.processInput("(");
calc1.processInput("(");
calc1.processInput("7");
calc1.processInput("-");
calc1.processInput("8");

calc1.processInput(")");
calc1.processInput("-");
calc1.processInput("(");
calc1.processInput("9");
calc1.processInput("*");
calc1.processInput("2");
calc1.processInput(")");
calc1.processInput(")");
calc1.processInput(")");
calc1.processInput(")");
