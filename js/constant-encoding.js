class ConstantEncoder {
    constructor() {
        this.mathFunctions = ['math.sin', 'math.cos', 'math.tan', 'math.log', 'math.exp', 'math.sqrt', 'math.floor', 'math.ceil'];
    }

    encodeConstant(value, level = 'medium') {
        if (typeof value === 'number') {
            return this.encodeNumber(value, level);
        } else if (typeof value === 'string') {
            return this.encodeString(value, level);
        } else if (typeof value === 'boolean') {
            return this.encodeBoolean(value, level);
        }
        return value;
    }

    encodeNumber(num, level) {
        const intensity = {
            low: 1,
            medium: 3,
            high: 5,
            extreme: 8
        }[level] || 3;

        let expression = num.toString();
        
        for (let i = 0; i < intensity; i++) {
            expression = this.wrapInMathExpression(expression);
        }
        
        return expression;
    }

    wrapInMathExpression(value) {
        const operations = [
            () => `(${value} + ${ZiaanUtils.randomInt(1, 100)} - ${ZiaanUtils.randomInt(1, 100)})`,
            () => `(${value} * ${ZiaanUtils.randomInt(2, 5)} / ${ZiaanUtils.randomInt(2, 5)})`,
            () => `(math.floor(${value} / ${ZiaanUtils.randomInt(2, 5)}) * ${ZiaanUtils.randomInt(2, 5)})`,
            () => {
                const func = this.mathFunctions[ZiaanUtils.randomInt(0, this.mathFunctions.length - 1)];
                const rand = ZiaanUtils.randomInt(1, 10);
                return `(${func}(${value} + ${rand}) * ${rand})`;
            },
            () => {
                const a = ZiaanUtils.randomInt(1, 50);
                const b = ZiaanUtils.randomInt(1, 50);
                return `((${value} + ${a}) * ${b} / ${b} - ${a})`;
            },
            () => {
                const hex = value.toString(16);
                return `tonumber("${hex}", 16)`;
            },
            () => {
                const bin = parseInt(value).toString(2);
                return `tonumber("${bin}", 2)`;
            }
        ];
        
        const selectedOp = operations[ZiaanUtils.randomInt(0, operations.length - 1)];
        return selectedOp();
    }

    encodeString(str, level) {
        // Convert string to character codes and create array
        const codes = [];
        for (let i = 0; i < str.length; i++) {
            codes.push(str.charCodeAt(i));
        }
        
        const intensity = {
            low: 1,
            medium: 2,
            high: 3,
            extreme: 5
        }[level] || 2;
        
        let result = `(function() local t={`;
        
        // Encode each character
        codes.forEach((code, index) => {
            let encodedChar = code.toString();
            for (let i = 0; i < intensity; i++) {
                encodedChar = this.wrapInMathExpression(encodedChar);
            }
            result += `${encodedChar},`;
        });
        
        result += `} local s="" for i,v in ipairs(t) do s=s..string.char(v) end return s end)()`;
        
        return result;
    }

    encodeBoolean(bool, level) {
        const intensity = {
            low: 1,
            medium: 2,
            high: 3,
            extreme: 4
        }[level] || 2;
        
        let expression = bool ? 'true' : 'false';
        
        for (let i = 0; i < intensity; i++) {
            const operations = [
                `(not not ${expression})`,
                `((${expression} == true) and true or false)`,
                `((${ZiaanUtils.randomInt(1, 100)} > ${ZiaanUtils.randomInt(1, 100)}) == ${expression})`,
                `(type(${expression}) == "boolean")`
            ];
            expression = operations[ZiaanUtils.randomInt(0, operations.length - 1)];
        }
        
        return expression;
    }

    generateMathObfuscationCode() {
        const mathFuncs = [
            'local _sin=math.sin local _cos=math.cos local _tan=math.tan',
            'local _log=math.log local _exp=math.exp local _sqrt=math.sqrt',
            'local _abs=math.abs local _floor=math.floor local _ceil=math.ceil',
            'local _max=math.max local _min=math.min local _random=math.random'
        ];
        
        return mathFuncs[ZiaanUtils.randomInt(0, mathFuncs.length - 1)];
    }
}
