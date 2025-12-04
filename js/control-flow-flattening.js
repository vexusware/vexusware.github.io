class ControlFlowFlattener {
    constructor() {
        this.stateVariables = [];
    }

    flattenCode(code, intensity = 'medium') {
        const blocks = this.extractCodeBlocks(code);
        if (blocks.length <= 1) return code;
        
        const flattened = this.createFlattenedStructure(blocks, intensity);
        return flattened;
    }

    extractCodeBlocks(code) {
        // Simple block extraction (in real implementation, use proper parser)
        const lines = code.split('\n');
        const blocks = [];
        let currentBlock = [];
        let braceCount = 0;
        
        for (const line of lines) {
            currentBlock.push(line);
            
            // Count braces to detect block boundaries
            braceCount += (line.match(/{/g) || []).length;
            braceCount -= (line.match(/}/g) || []).length;
            
            if (braceCount === 0 && currentBlock.length > 0) {
                blocks.push(currentBlock.join('\n'));
                currentBlock = [];
            }
        }
        
        if (currentBlock.length > 0) {
            blocks.push(currentBlock.join('\n'));
        }
        
        return blocks;
    }

    createFlattenedStructure(blocks, intensity) {
        const stateVar = `_state${ZiaanUtils.randomInt(1000, 9999)}`;
        this.stateVariables.push(stateVar);
        
        const switchCases = [];
        blocks.forEach((block, index) => {
            const nextState = index < blocks.length - 1 ? index + 1 : -1;
            switchCases.push(`
            if ${stateVar} == ${index} then
                ${block}
                ${stateVar} = ${nextState}
            end`);
        });
        
        const intensityLevels = {
            low: 1,
            medium: 2,
            high: 3
        };
        
        const layers = intensityLevels[intensity] || 2;
        let flattenedCode = '';
        
        for (let i = 0; i < layers; i++) {
            const layerVar = `${stateVar}_${i}`;
            flattenedCode += `
            local ${layerVar} = 0
            while ${layerVar} >= 0 do
                ${switchCases.join('\n')}
                if ${layerVar} == -1 then break end
            end
            `;
        }
        
        // Add junk blocks
        flattenedCode = this.addJunkBlocks(flattenedCode, blocks.length * 2);
        
        return flattenedCode;
    }

    addJunkBlocks(code, count) {
        const junkBlocks = [];
        
        for (let i = 0; i < count; i++) {
            const junkTypes = [
                `local _junk${i} = function() return ${ZiaanUtils.randomInt(1, 100)} end`,
                `if false then local _x = ${ZiaanUtils.randomInt(1, 1000)} end`,
                `for _=1,0 do local _y = "${ZiaanUtils.randomString(10)}" end`,
                `while false do local _z = math.random() end`,
                `local _arr${i} = {${Array.from({length: 5}, () => ZiaanUtils.randomInt(1, 100)).join(',')}}`,
                `local _str${i} = "${ZiaanUtils.randomString(15)}":reverse()`,
                `local _func${i} = function() return function() end end`
            ];
            
            junkBlocks.push(junkTypes[ZiaanUtils.randomInt(0, junkTypes.length - 1)]);
        }
        
        // Insert junk blocks randomly
        const lines = code.split('\n');
        const insertPositions = [];
        
        for (let i = 0; i < Math.min(junkBlocks.length, lines.length); i++) {
            const pos = ZiaanUtils.randomInt(0, lines.length - 1);
            insertPositions.push({pos, block: junkBlocks[i]});
        }
        
        insertPositions.sort((a, b) => b.pos - a.pos);
        
        insertPositions.forEach(({pos, block}) => {
            lines.splice(pos, 0, block);
        });
        
        return lines.join('\n');
    }

    generateStateMachine() {
        const stateMachine = `
        local _fsm_state = 0
        local _fsm_states = {}
        
        local function _fsm_next()
            _fsm_state = _fsm_state + 1
            if _fsm_states[_fsm_state] then
                return _fsm_states[_fsm_state]()
            end
            return nil
        end
        
        local function _fsm_add(state, func)
            _fsm_states[state] = func
        end
        `;
        
        return stateMachine;
    }
}
