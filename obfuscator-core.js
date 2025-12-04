// Engine Obfuscator Lua/Luau dengan Junk Code Advanced
class LuaObfuscator {
    constructor() {
        this.jawaChars = "ꦄꦆꦇꦈꦉꦊꦋꦌꦍꦎꦏꦐꦑꦒꦓꦔꦕꦖꦗꦘꦙꦚꦛꦜꦝꦞꦟꦠꦡꦢꦣꦤꦥꦦꦧꦨꦩꦪꦫꦬꦭꦮꦯꦰꦱꦲꦴꦵꦶꦷꦸꦹꦺꦻꦼꦽꦾꦿꦀꦁꦂꦃ꦳ꦽꦾꦿꦀ";
        this.cinaChars = "的一是不了人我在有他这为之大来以个中上们到说国和地也子时道出而要于就下得可你年生自会那后能对着事其里所去行过家十用发天如然作方成者多日都三小军二无同么经法当起与好看学进种将还分此心前面又定见只主没公从今回很己最但现前些所同起好长看被进";
        this.unicodeRanges = [
            { start: 0x0400, end: 0x04FF },   // Cyrillic
            { start: 0x0370, end: 0x03FF },   // Greek
            { start: 0x0900, end: 0x097F },   // Devanagari
            { start: 0x0600, end: 0x06FF },   // Arabic
            { start: 0x0E00, end: 0x0E7F },   // Thai
            { start: 0xAC00, end: 0xD7AF },   // Hangul
        ];
        
        this.obfuscatedVars = new Map();
        this.varCounter = 0;
        this.stringEncryptionKey = null;
        this.junkCodeCounter = 0;
        this.junkFunctions = [];
    }
    
    // Generate random aksara Jawa
    generateJawaName(length = 6) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += this.jawaChars.charAt(Math.floor(Math.random() * this.jawaChars.length));
        }
        return result;
    }
    
    // Generate random karakter Cina
    generateCinaName(length = 3) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += this.cinaChars.charAt(Math.floor(Math.random() * this.cinaChars.length));
        }
        return result;
    }
    
    // Generate random Unicode
    generateUnicodeName(length = 4) {
        let result = '';
        for (let i = 0; i < length; i++) {
            const range = this.unicodeRanges[Math.floor(Math.random() * this.unicodeRanges.length)];
            const charCode = Math.floor(Math.random() * (range.end - range.start + 1)) + range.start;
            result += String.fromCharCode(charCode);
        }
        return result;
    }
    
    // Generate nama variabel berdasarkan setting
    generateVarName(type = 'campur') {
        this.varCounter++;
        
        if (type === 'jawa') return this.generateJawaName();
        if (type === 'cina') return this.generateCinaName();
        if (type === 'unicode') return this.generateUnicodeName();
        
        // Campuran Jawa + Cina
        if (Math.random() > 0.5) {
            return this.generateJawaName(4) + this.generateCinaName(2);
        } else {
            return this.generateCinaName(2) + this.generateJawaName(4);
        }
    }
    
    // Generate random math expression untuk junk code
    generateMathExpression(complexity = 1) {
        const operators = ['+', '-', '*', '/', '%', '^'];
        const mathFuncs = ['math.sin', 'math.cos', 'math.tan', 'math.floor', 'math.ceil', 'math.abs', 'math.sqrt', 'math.log', 'math.exp'];
        const vars = ['x', 'y', 'z', 'a', 'b', 'c', 't', 'n'];
        
        if (complexity === 1) {
            // Simple expression
            return `${Math.floor(Math.random() * 1000)} ${operators[Math.floor(Math.random() * operators.length)]} ${Math.floor(Math.random() * 1000)}`;
        } else if (complexity === 2) {
            // Medium expression with function
            return `${mathFuncs[Math.floor(Math.random() * mathFuncs.length)]}(${Math.floor(Math.random() * 100)})`;
        } else {
            // Complex expression
            const var1 = vars[Math.floor(Math.random() * vars.length)];
            const var2 = vars[Math.floor(Math.random() * vars.length)];
            return `(${var1} ${operators[Math.floor(Math.random() * operators.length)]} ${Math.floor(Math.random() * 100)}) ${operators[Math.floor(Math.random() * operators.length)]} (${var2} ${operators[Math.floor(Math.random() * operators.length)]} ${mathFuncs[Math.floor(Math.random() * mathFuncs.length)]}(${Math.floor(Math.random() * 50)}))`;
        }
    }
    
    // Generate random Lua table untuk junk code
    generateRandomTable(entries = 5) {
        let tableCode = '{';
        for (let i = 0; i < entries; i++) {
            const keyTypes = ['number', 'string', 'boolean', 'nil'];
            const keyType = keyTypes[Math.floor(Math.random() * keyTypes.length)];
            
            let key, value;
            switch (keyType) {
                case 'number':
                    key = Math.floor(Math.random() * 100);
                    value = Math.random() > 0.5 ? `"${this.generateJawaName(3)}"` : Math.floor(Math.random() * 1000);
                    tableCode += `[${key}] = ${value}, `;
                    break;
                case 'string':
                    key = `"${this.generateCinaName(2)}${Math.floor(Math.random() * 100)}"`;
                    value = Math.random() > 0.5 ? Math.random() > 0.5 : `function() return ${Math.floor(Math.random() * 100)} end`;
                    tableCode += `${key} = ${value}, `;
                    break;
                default:
                    tableCode += `"${this.generateUnicodeName(2)}" = ${Math.floor(Math.random() * 100)}, `;
            }
        }
        tableCode += '}';
        return tableCode;
    }
    
    // Generate junk function (fungsi tidak berguna)
    generateJunkFunction(type = 'simple') {
        const funcName = this.generateVarName('campur');
        this.junkFunctions.push(funcName);
        
        let funcCode = '';
        const paramCount = Math.floor(Math.random() * 3) + 1;
        const params = [];
        
        for (let i = 0; i < paramCount; i++) {
            params.push(this.generateVarName('jawa'));
        }
        
        funcCode += `local function ${funcName}(${params.join(', ')})\n`;
        funcCode += `    local ${this.generateVarName('cina')} = ${Math.floor(Math.random() * 1000)}\n`;
        
        // Add random operations
        const operations = Math.floor(Math.random() * 5) + 3;
        for (let i = 0; i < operations; i++) {
            if (Math.random() > 0.5) {
                funcCode += `    local ${this.generateVarName('unicode')} = ${this.generateMathExpression(Math.floor(Math.random() * 3) + 1)}\n`;
            } else {
                funcCode += `    ${this.generateVarName('campur')} = ${this.generateVarName('campur')} or ${Math.floor(Math.random() * 100)}\n`;
            }
        }
        
        // Add conditional junk
        if (Math.random() > 0.3) {
            funcCode += `    if ${Math.floor(Math.random() * 100)} > ${Math.floor(Math.random() * 100)} then\n`;
            funcCode += `        return ${Math.floor(Math.random() * 1000)}\n`;
            funcCode += `    else\n`;
            funcCode += `        return ${Math.floor(Math.random() * 1000)}\n`;
            funcCode += `    end\n`;
        } else {
            funcCode += `    return ${params.length > 0 ? params[0] : Math.floor(Math.random() * 100)}\n`;
        }
        
        funcCode += `end\n\n`;
        return funcCode;
    }
    
    // Generate junk class atau metatable
    generateJunkClass() {
        const className = this.generateVarName('campur');
        let classCode = `\n-- Junk class ${className}\n`;
        classCode += `local ${className} = {}\n`;
        classCode += `${className}.__index = ${className}\n\n`;
        
        classCode += `function ${className}.new()\n`;
        classCode += `    local self = setmetatable({}, ${className})\n`;
        
        // Add random properties
        const propCount = Math.floor(Math.random() * 5) + 2;
        for (let i = 0; i < propCount; i++) {
            const propName = this.generateVarName('jawa');
            classCode += `    self.${propName} = ${Math.floor(Math.random() * 1000)}\n`;
        }
        
        classCode += `    return self\n`;
        classCode += `end\n\n`;
        
        // Add some methods
        const methodCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < methodCount; i++) {
            const methodName = this.generateVarName('cina');
            classCode += `function ${className}:${methodName}()\n`;
            classCode += `    return ${Math.floor(Math.random() * 1000)}\n`;
            classCode += `end\n\n`;
        }
        
        return classCode;
    }
    
    // Generate junk loop (loop tidak berguna)
    generateJunkLoop() {
        const loopTypes = ['for', 'while', 'repeat'];
        const loopType = loopTypes[Math.floor(Math.random() * loopTypes.length)];
        let loopCode = '';
        
        switch (loopType) {
            case 'for':
                const loopVar = this.generateVarName('jawa');
                const start = Math.floor(Math.random() * 100);
                const end = start + Math.floor(Math.random() * 50);
                loopCode += `for ${loopVar} = ${start}, ${end} do\n`;
                loopCode += `    local ${this.generateVarName('cina')} = ${loopVar} * ${Math.floor(Math.random() * 10)}\n`;
                loopCode += `    if ${this.generateVarName('cina')} > ${Math.floor(Math.random() * 100)} then\n`;
                loopCode += `        break\n`;
                loopCode += `    end\n`;
                loopCode += `end\n`;
                break;
                
            case 'while':
                loopCode += `while ${Math.floor(Math.random() * 100)} < ${Math.floor(Math.random() * 100)} do\n`;
                loopCode += `    local ${this.generateVarName('unicode')} = ${Math.floor(Math.random() * 1000)}\n`;
                loopCode += `    if ${Math.floor(Math.random() * 100)} == ${Math.floor(Math.random() * 100)} then\n`;
                loopCode += `        break\n`;
                loopCode += `    end\n`;
                loopCode += `end\n`;
                break;
                
            case 'repeat':
                loopCode += `repeat\n`;
                loopCode += `    local ${this.generateVarName('campur')} = ${this.generateMathExpression(2)}\n`;
                loopCode += `    local ${this.generateVarName('jawa')} = not (${this.generateVarName('campur')} and true)\n`;
                loopCode += `until ${Math.floor(Math.random() * 100)} > ${Math.floor(Math.random() * 100)}\n`;
                break;
        }
        
        return loopCode;
    }
    
    // Tambahkan junk code berdasarkan tingkat obfuscasi
    addJunkCode(code, level) {
        if (level < 1) return code;
        
        this.junkCodeCounter = 0;
        this.junkFunctions = [];
        
        const lines = code.split('\n');
        const resultLines = [];
        
        // Tentukan jumlah junk berdasarkan level
        let junkFactor;
        switch (level) {
            case 1: junkFactor = 0.1; break; // 10% junk
            case 2: junkFactor = 0.3; break; // 30% junk
            case 3: junkFactor = 0.5; break; // 50% junk
            default: junkFactor = 0.1;
        }
        
        const totalJunkItems = Math.max(3, Math.floor(lines.length * junkFactor));
        
        // Tambahkan junk functions di awal
        const junkFuncCount = Math.floor(totalJunkItems * 0.3);
        let junkHeader = '\n-- BEGIN JUNK CODE SECTION --\n';
        for (let i = 0; i < junkFuncCount; i++) {
            junkHeader += this.generateJunkFunction(i % 3 === 0 ? 'complex' : 'simple');
            this.junkCodeCounter++;
        }
        
        // Tambahkan junk classes
        const junkClassCount = Math.floor(totalJunkItems * 0.2);
        for (let i = 0; i < junkClassCount; i++) {
            junkHeader += this.generateJunkClass();
            this.junkCodeCounter++;
        }
        junkHeader += '-- END JUNK CODE SECTION --\n\n';
        
        // Sisipkan junk code di antara baris kode asli
        let insertedJunk = 0;
        const insertInterval = Math.max(2, Math.floor(lines.length / totalJunkItems));
        
        for (let i = 0; i < lines.length; i++) {
            resultLines.push(lines[i]);
            
            // Sisipkan junk code pada interval tertentu
            if (insertedJunk < totalJunkItems && i > 0 && i % insertInterval === 0) {
                // Pilih jenis junk code secara acak
                const junkType = Math.floor(Math.random() * 4);
                
                switch (junkType) {
                    case 0: // Variable assignment
                        resultLines.push(`    local ${this.generateVarName('campur')} = ${this.generateMathExpression(Math.floor(Math.random() * 3) + 1)}`);
                        break;
                    case 1: // Table creation
                        resultLines.push(`    local ${this.generateVarName('jawa')} = ${this.generateRandomTable(Math.floor(Math.random() * 3) + 2)}`);
                        break;
                    case 2: // Function call (jika ada junk function)
                        if (this.junkFunctions.length > 0) {
                            const randomFunc = this.junkFunctions[Math.floor(Math.random() * this.junkFunctions.length)];
                            resultLines.push(`    local ${this.generateVarName('cina')} = ${randomFunc}(${Math.floor(Math.random() * 100)})`);
                        } else {
                            resultLines.push(`    local ${this.generateVarName('unicode')} = ${Math.floor(Math.random() * 1000)}`);
                        }
                        break;
                    case 3: // Loop
                        resultLines.push('    ' + this.generateJunkLoop().replace(/\n/g, '\n    '));
                        break;
                }
                
                insertedJunk++;
                this.junkCodeCounter++;
            }
        }
        
        // Gabungkan header junk code dengan kode utama
        const finalCode = junkHeader + resultLines.join('\n');
        
        // Tambahkan junk code di akhir
        let junkFooter = '\n\n-- FINAL JUNK CODE BLOCK --\n';
        const finalJunkCount = Math.floor(totalJunkItems * 0.2);
        for (let i = 0; i < finalJunkCount; i++) {
            junkFooter += this.generateJunkLoop();
            this.junkCodeCounter++;
        }
        
        return finalCode + junkFooter;
    }
    
    // Simple string encryption (base64 dengan XOR)
    encryptString(str, key = null) {
        if (!key) {
            key = Math.floor(Math.random() * 255) + 1;
            this.stringEncryptionKey = key;
        }
        
        // XOR encryption
        let encrypted = '';
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i) ^ key;
            encrypted += String.fromCharCode(charCode);
        }
        
        // Convert to base64 untuk tampilan
        const base64 = btoa(encrypted);
        return { encrypted: base64, key: key };
    }
    
    // Generate decryption function untuk string
    generateDecryptFunction() {
        const funcName = this.generateVarName('campur');
        return `
local function ${funcName}(str, key)
    local result = ""
    local decoded = string.char(table.unpack({string.byte(str, 1, #str)}))
    for i = 1, #decoded do
        result = result .. string.char(string.byte(decoded, i) ~ key)
    end
    return result
end
`;
    }
    
    // Parse dan extract variabel dari kode Lua
    extractVariables(code) {
        const variablePatterns = [
            /local\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*[=,\n]?/g,
            /function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
            /([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*[^=\n]+/g,
            /for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+/g,
            /\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*[,)]/g
        ];
        
        const variables = new Set();
        const protectedVars = new Set(['game', 'workspace', 'script', 'wait', 'print', 'tick', 'time', 'spawn', 'delay', 'Instance', 'Vector3', 'CFrame', 'Color3', 'UDim2', 'Enum', 'require', 'math', 'string', 'table', 'coroutine', 'os', 'debug', 'bit32', 'utf8', '_G', 'self', 'arg', '...']);
        
        for (const pattern of variablePatterns) {
            let match;
            while ((match = pattern.exec(code)) !== null) {
                const varName = match[1];
                if (varName && !protectedVars.has(varName) && varName.length > 1) {
                    variables.add(varName);
                }
            }
        }
        
        return Array.from(variables);
    }
    
    // Replace variabel dengan nama baru
    replaceVariables(code, varType) {
        const variables = this.extractVariables(code);
        this.obfuscatedVars.clear();
        
        // Generate nama baru untuk setiap variabel
        for (const varName of variables) {
            const newName = this.generateVarName(varType);
            this.obfuscatedVars.set(varName, newName);
        }
        
        // Lakukan replacement
        let obfuscatedCode = code;
        const sortedVars = Array.from(this.obfuscatedVars.entries())
            .sort((a, b) => b[0].length - a[0].length); // Sort panjang descending
        
        for (const [oldName, newName] of sortedVars) {
            const regex = new RegExp(`\\b${oldName}\\b`, 'g');
            obfuscatedCode = obfuscatedCode.replace(regex, newName);
        }
        
        return { code: obfuscatedCode, count: variables.length };
    }
    
    // Obfuscate string literals
    encryptStrings(code, enableEncryption) {
        if (!enableEncryption) return { code, encryptedStrings: [] };
        
        const stringRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
        const encryptedStrings = [];
        let match;
        let lastIndex = 0;
        let result = '';
        
        while ((match = stringRegex.exec(code)) !== null) {
            result += code.substring(lastIndex, match.index);
            
            const str = match[0];
            // Skip string pendek (kurang dari 3 karakter)
            if (str.length <= 5) {
                result += str;
            } else {
                const encrypted = this.encryptString(str.slice(1, -1));
                const varName = this.generateVarName('jawa');
                encryptedStrings.push({
                    varName,
                    encrypted: encrypted.encrypted,
                    key: encrypted.key
                });
                result += `${varName}()`;
            }
            
            lastIndex = match.index + str.length;
        }
        
        result += code.substring(lastIndex);
        return { code: result, encryptedStrings };
    }
    
    // Tambahkan anti-tamper protection
    addAntiTamper(code, level) {
        if (level < 2) return code;
        
        const tamperFunc = `
-- Anti-tamper protection level ${level}
local function ${this.generateVarName('cina')}()
    local ${this.generateVarName()} = tostring(script)
    local ${this.generateVarName()} = #${this.generateVarName()}
    local ${this.generateVarName()} = tick()
    
    -- Check script size
    if ${this.generateVarName()} < 10 then
        while true do end  -- Infinite loop jika script dimodifikasi
    end
    
    -- Time-based check
    if ${this.generateVarName()} < 0 then
        error("Script integrity check failed")
    end
    
    -- Memory check
    local ${this.generateVarName()} = collectgarbage("count")
    if ${this.generateVarName()} > 1000000 then
        require(0)  -- Crash script
    end
    
    return true
end

-- Execute tamper check in coroutine
spawn(function()
    ${this.generateVarName('cina')}()
end)
`;
        
        return tamperFunc + '\n' + code;
    }
    
    // Tambahkan control flow obfuscation
    addControlFlowObfuscation(code, level) {
        if (level < 3) return code;
        
        // Advanced control flow obfuscation
        const switchVar = this.generateVarName('jawa');
        const cases = Math.floor(Math.random() * 5) + 3;
        
        let switchCode = `
-- Advanced control flow obfuscation
local ${switchVar} = ${Math.floor(Math.random() * cases)}
local ${this.generateVarName()} = function()
    if ${switchVar} == 0 then
        ${switchVar} = ${switchVar} + 1
    end
    
    repeat
        ${switchVar} = ${switchVar} - 1
    until ${switchVar} <= 0
end

${this.generateVarName()}()
`;
        
        // Wrap main code in switch-like structure
        const wrappedCode = `
-- Main code wrapper
local ${this.generateVarName('cina')} = ${Math.floor(Math.random() * 100)}
if ${this.generateVarName('cina')} ~= nil then
    for i = 1, 10 do
        if i % 2 == 0 then
            ${code.replace(/\n/g, '\n            ')}
            break
        else
            -- Fake branch
            local ${this.generateVarName()} = ${Math.floor(Math.random() * 1000)}
        end
    end
else
    -- Dead branch
    while false do
        print("This never executes")
    end
end
`;
        
        return switchCode + '\n' + wrappedCode;
    }
    
    // Tambahkan fake error handling
    addFakeErrorHandling(code) {
        const errorFunc = `
-- Fake error handling system
local ${this.generateVarName('campur')} = function()
    local success, err = pcall(function()
        -- Fake error
        error("Fake error for obfuscation", 0)
    end)
    
    if not success then
        -- Do nothing, just consume the error
        local ${this.generateVarName()} = tostring(err)
    end
    
    return true
end

${this.generateVarName('campur')}()
`;
        
        return errorFunc + '\n' + code;
    }
    
    // Main obfuscation function
    obfuscate(code, options) {
        const {
            obfLevel = 3,
            varObf = 'campur',
            antiTamper = true,
            stringEncrypt = true,
            controlFlow = true,
            deadCode = true,
            junkCode = true
        } = options;
        
        console.log(`Starting obfuscation with level: ${obfLevel}`);
        
        // Reset counter
        this.varCounter = 0;
        this.junkCodeCounter = 0;
        this.junkFunctions = [];
        
        // Step 1: Replace variables
        console.log("Step 1: Replacing variables...");
        const varResult = this.replaceVariables(code, varObf);
        let obfuscated = varResult.code;
        const varCount = varResult.count;
        
        // Step 2: Encrypt strings
        console.log("Step 2: Encrypting strings...");
        const stringResult = this.encryptStrings(obfuscated, stringEncrypt);
        obfuscated = stringResult.code;
        const encryptedStrings = stringResult.encryptedStrings;
        
        // Step 3: Add decryption function if strings were encrypted
        if (encryptedStrings.length > 0) {
            console.log("Adding string decryption function...");
            const decryptFunc = this.generateDecryptFunction();
            obfuscated = decryptFunc + '\n' + obfuscated;
            
            // Add the actual string variables
            let stringVars = '\n-- Encrypted strings\n';
            encryptedStrings.forEach(s => {
                stringVars += `local ${s.varName} = function() return ${this.generateVarName('cina')}("${s.encrypted}", ${s.key}) end\n`;
            });
            obfuscated = stringVars + '\n' + obfuscated;
        }
        
        // Step 4: Add junk code
        if (junkCode) {
            console.log(`Step 4: Adding junk code (level: ${obfLevel})...`);
            obfuscated = this.addJunkCode(obfuscated, obfLevel);
        }
        
        // Step 5: Add control flow obfuscation
        if (controlFlow && obfLevel > 2) {
            console.log("Step 5: Adding control flow obfuscation...");
            obfuscated = this.addControlFlowObfuscation(obfuscated, obfLevel);
        }
        
        // Step 6: Add anti-tamper protection
        if (antiTamper) {
            console.log("Step 6: Adding anti-tamper protection...");
            obfuscated = this.addAntiTamper(obfuscated, obfLevel);
        }
        
        // Step 7: Add fake error handling
        if (obfLevel > 1) {
            console.log("Step 7: Adding fake error handling...");
            obfuscated = this.addFakeErrorHandling(obfuscated);
        }
        
        // Step 8: Add header comment
        const header = `--[[
    Lua/Luau Advanced Obfuscator v3.0
    Obfuscated with Roblox Lua Obfuscator
    Security Level: ${obfLevel === 1 ? 'Low' : obfLevel === 2 ? 'Medium' : 'High'}
    Variables Obfuscated: ${varCount}
    Strings Encrypted: ${encryptedStrings.length}
    Junk Code Added: ${this.junkCodeCounter} items
    Protection: ${antiTamper ? 'Anti-Tamper ✓' : ''} ${controlFlow ? 'Control Flow ✓' : ''} ${stringEncrypt ? 'String Encrypt ✓' : ''}
    Timestamp: ${new Date().toLocaleString()}
    WARNING: Do not attempt to deobfuscate!
--]]

`;
        
        obfuscated = header + obfuscated;
        
        console.log(`Obfuscation complete! Added ${this.junkCodeCounter} junk code items.`);
        
        return {
            code: obfuscated,
            stats: {
                variablesObfuscated: varCount,
                stringsEncrypted: encryptedStrings.length,
                junkCodeAdded: this.junkCodeCounter,
                originalLength: code.length,
                obfuscatedLength: obfuscated.length,
                junkPercentage: ((this.junkCodeCounter / (code.split('\n').length + this.junkCodeCounter)) * 100).toFixed(1),
                securityLevel: obfLevel
            }
        };
    }
}

// Buat instance global
window.LuaObfuscator = LuaObfuscator;
