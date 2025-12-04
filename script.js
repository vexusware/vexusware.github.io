// ZiaanVeil - Main Application Script

class ZiaanVeilApp {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadSettings();
        this.updateCharCount();
        this.setupObfuscator();
    }

    initializeElements() {
        // Theme
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle.querySelector('i');

        // Code areas
        this.sourceCode = document.getElementById('sourceCode');
        this.outputCode = document.getElementById('outputCode');
        this.charCount = document.getElementById('charCount');

        // Buttons
        this.obfuscateBtn = document.getElementById('obfuscateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.settingsToggle = document.getElementById('settingsToggle');
        this.closeSettings = document.getElementById('closeSettings');
        this.exampleBtn = document.getElementById('exampleBtn');
        this.clearInputBtn = document.getElementById('clearInputBtn');
        this.resetSettingsBtn = document.getElementById('resetSettings');
        this.saveSettingsBtn = document.getElementById('saveSettings');

        // Settings panel
        this.settingsPanel = document.getElementById('settingsPanel');

        // Settings controls
        this.enableStringEnc = document.getElementById('enableStringEnc');
        this.enableXOR = document.getElementById('enableXOR');
        this.enableBase64 = document.getElementById('enableBase64');
        this.xorKey = document.getElementById('xorKey');
        this.enableConstantEnc = document.getElementById('enableConstantEnc');
        this.constantMethod = document.getElementById('constantMethod');
        this.enableControlFlow = document.getElementById('enableControlFlow');
        this.cfComplexity = document.getElementById('cfComplexity');
        this.enableRenaming = document.getElementById('enableRenaming');
        this.renameType = document.getElementById('renameType');
        this.renameObfuscate = document.getElementById('renameObfuscate');
        this.enableBytecode = document.getElementById('enableBytecode');
        this.enableVM = document.getElementById('enableVM');
        this.vmComplexity = document.getElementById('vmComplexity');
        this.enableDeadCode = document.getElementById('enableDeadCode');
        this.enableDebugProtection = document.getElementById('enableDebugProtection');
        this.enableSelfDefending = document.getElementById('enableSelfDefending');

        // Output controls
        this.obfLevel = document.getElementById('obfLevel');
        this.languageType = document.getElementById('languageType');

        // Indicators
        this.stringEncIndicator = document.getElementById('stringEncIndicator');
        this.controlFlowIndicator = document.getElementById('controlFlowIndicator');
        this.renamingIndicator = document.getElementById('renamingIndicator');
        this.bytecodeIndicator = document.getElementById('bytecodeIndicator');
        this.vmIndicator = document.getElementById('vmIndicator');

        // Stats
        this.obfuscationTime = document.getElementById('obfuscationTime');
        this.sizeIncrease = document.getElementById('sizeIncrease');
        this.obfuscationLevel = document.getElementById('obfuscationLevel');

        // Toast
        this.toast = document.getElementById('toast');

        // Obfuscator instance
        this.obfuscator = null;
    }

    setupEventListeners() {
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Code input events
        this.sourceCode.addEventListener('input', () => this.updateCharCount());

        // Button events
        this.obfuscateBtn.addEventListener('click', () => this.obfuscateCode());
        this.copyBtn.addEventListener('click', () => this.copyOutput());
        this.downloadBtn.addEventListener('click', () => this.downloadOutput());
        this.settingsToggle.addEventListener('click', () => this.toggleSettings());
        this.closeSettings.addEventListener('click', () => this.toggleSettings(false));
        this.exampleBtn.addEventListener('click', () => this.loadExample());
        this.clearInputBtn.addEventListener('click', () => this.clearInput());
        this.resetSettingsBtn.addEventListener('click', () => this.resetSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());

        // Settings changes
        this.enableStringEnc.addEventListener('change', () => this.updateIndicators());
        this.enableControlFlow.addEventListener('change', () => this.updateIndicators());
        this.enableRenaming.addEventListener('change', () => this.updateIndicators());
        this.enableBytecode.addEventListener('change', () => this.updateIndicators());
        this.enableVM.addEventListener('change', () => this.updateIndicators());

        // Obfuscation level change
        this.obfLevel.addEventListener('change', () => this.applyObfuscationLevel());

        // Close settings when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.settingsPanel.contains(e.target) && 
                !this.settingsToggle.contains(e.target) && 
                this.settingsPanel.classList.contains('active')) {
                this.toggleSettings(false);
            }
        });
    }

    setupObfuscator() {
        this.obfuscator = new ZiaanObfuscator();
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            this.themeIcon.className = 'fas fa-sun';
            this.themeToggle.innerHTML = '<i class="fas fa-sun"></i> Mode Terang';
        } else {
            this.themeIcon.className = 'fas fa-moon';
            this.themeToggle.innerHTML = '<i class="fas fa-moon"></i> Mode Gelap';
        }
        this.saveSettings();
    }

    updateCharCount() {
        const count = this.sourceCode.value.length;
        this.charCount.textContent = count.toLocaleString();
    }

    async obfuscateCode() {
        const source = this.sourceCode.value.trim();
        
        if (!source) {
            this.showToast('Masukkan kode sumber terlebih dahulu', 'warning');
            return;
        }

        // Disable button and show loading
        this.obfuscateBtn.disabled = true;
        const originalText = this.obfuscateBtn.innerHTML;
        this.obfuscateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';

        // Get settings
        const settings = this.getSettings();

        try {
            const startTime = performance.now();
            
            // Perform obfuscation
            const result = await this.obfuscator.obfuscate(source, settings);
            
            const endTime = performance.now();
            const timeTaken = endTime - startTime;

            // Update output
            this.outputCode.value = result.code;
            
            // Update stats
            this.updateStats(source, result.code, timeTaken, settings);
            
            // Update indicators
            this.updateIndicators();
            
            // Enable output buttons
            this.copyBtn.disabled = false;
            this.downloadBtn.disabled = false;
            
            this.showToast('Obfuscation berhasil!', 'success');
        } catch (error) {
            console.error('Obfuscation error:', error);
            this.outputCode.value = `-- Error saat obfuscation:\n-- ${error.message}\n\n${error.stack || ''}`;
            this.showToast('Error saat obfuscation', 'error');
        } finally {
            // Restore button
            this.obfuscateBtn.disabled = false;
            this.obfuscateBtn.innerHTML = originalText;
        }
    }

    updateStats(source, obfuscated, timeTaken, settings) {
        // Calculate time
        this.obfuscationTime.textContent = `Waktu: ${timeTaken.toFixed(2)}ms`;
        
        // Calculate size increase
        const originalSize = source.length;
        const obfuscatedSize = obfuscated.length;
        const increase = ((obfuscatedSize - originalSize) / originalSize * 100).toFixed(1);
        this.sizeIncrease.textContent = `Ukuran: ${obfuscatedSize.toLocaleString()} (+${increase}%)`;
        
        // Obfuscation level
        let level = 0;
        if (settings.stringEncryption) level += 20;
        if (settings.controlFlowFlattening) level += 25;
        if (settings.variableRenaming) level += 20;
        if (settings.bytecodeGeneration) level += 15;
        if (settings.vmProtection) level += 20;
        if (settings.enableDeadCode) level += 10;
        if (settings.enableDebugProtection) level += 15;
        if (settings.enableSelfDefending) level += 15;
        
        this.obfuscationLevel.textContent = `Tingkat: ${Math.min(level, 100)}%`;
    }

    updateIndicators() {
        const settings = this.getSettings();
        
        this.stringEncIndicator.classList.toggle('active', settings.stringEncryption);
        this.controlFlowIndicator.classList.toggle('active', settings.controlFlowFlattening);
        this.renamingIndicator.classList.toggle('active', settings.variableRenaming);
        this.bytecodeIndicator.classList.toggle('active', settings.bytecodeGeneration);
        this.vmIndicator.classList.toggle('active', settings.vmProtection);
    }

    getSettings() {
        return {
            // String encryption
            stringEncryption: this.enableStringEnc.checked,
            useXOR: this.enableXOR.checked,
            useBase64: this.enableBase64.checked,
            xorKey: this.xorKey.value,
            
            // Constant encoding
            constantEncoding: this.enableConstantEnc.checked,
            constantMethod: this.constantMethod.value,
            
            // Control flow
            controlFlowFlattening: this.enableControlFlow.checked,
            cfComplexity: this.cfComplexity.value,
            
            // Renaming
            variableRenaming: this.enableRenaming.checked,
            renameType: this.renameType.value,
            renameObfuscate: this.renameObfuscate.checked,
            
            // Bytecode & VM
            bytecodeGeneration: this.enableBytecode.checked,
            vmProtection: this.enableVM.checked,
            vmComplexity: this.vmComplexity.value,
            
            // Additional
            enableDeadCode: this.enableDeadCode.checked,
            enableDebugProtection: this.enableDebugProtection.checked,
            enableSelfDefending: this.enableSelfDefending.checked,
            
            // General
            obfuscationLevel: this.obfLevel.value,
            languageType: this.languageType.value
        };
    }

    applyObfuscationLevel() {
        const level = this.obfLevel.value;
        
        switch(level) {
            case 'low':
                this.enableStringEnc.checked = true;
                this.enableXOR.checked = true;
                this.enableBase64.checked = false;
                this.enableConstantEnc.checked = true;
                this.enableControlFlow.checked = false;
                this.enableRenaming.checked = true;
                this.enableBytecode.checked = false;
                this.enableVM.checked = false;
                this.enableDeadCode.checked = false;
                this.enableDebugProtection.checked = false;
                this.enableSelfDefending.checked = false;
                break;
                
            case 'medium':
                this.enableStringEnc.checked = true;
                this.enableXOR.checked = true;
                this.enableBase64.checked = true;
                this.enableConstantEnc.checked = true;
                this.enableControlFlow.checked = true;
                this.cfComplexity.value = 'medium';
                this.enableRenaming.checked = true;
                this.renameType.value = 'mixed';
                this.enableBytecode.checked = false;
                this.enableVM.checked = false;
                this.enableDeadCode.checked = true;
                this.enableDebugProtection.checked = false;
                this.enableSelfDefending.checked = false;
                break;
                
            case 'high':
                this.enableStringEnc.checked = true;
                this.enableXOR.checked = true;
                this.enableBase64.checked = true;
                this.enableConstantEnc.checked = true;
                this.enableControlFlow.checked = true;
                this.cfComplexity.value = 'high';
                this.enableRenaming.checked = true;
                this.renameType.value = 'mixed';
                this.enableBytecode.checked = true;
                this.enableVM.checked = false;
                this.enableDeadCode.checked = true;
                this.enableDebugProtection.checked = true;
                this.enableSelfDefending.checked = false;
                break;
                
            case 'extreme':
                this.enableStringEnc.checked = true;
                this.enableXOR.checked = true;
                this.enableBase64.checked = true;
                this.enableConstantEnc.checked = true;
                this.enableControlFlow.checked = true;
                this.cfComplexity.value = 'high';
                this.enableRenaming.checked = true;
                this.renameType.value = 'mixed';
                this.enableBytecode.checked = true;
                this.enableVM.checked = true;
                this.vmComplexity.value = 'complex';
                this.enableDeadCode.checked = true;
                this.enableDebugProtection.checked = true;
                this.enableSelfDefending.checked = true;
                break;
        }
        
        this.updateIndicators();
    }

    copyOutput() {
        if (!this.outputCode.value) return;
        
        navigator.clipboard.writeText(this.outputCode.value)
            .then(() => this.showToast('Kode disalin ke clipboard', 'success'))
            .catch(err => {
                console.error('Copy failed:', err);
                this.showToast('Gagal menyalin kode', 'error');
            });
    }

    downloadOutput() {
        if (!this.outputCode.value) return;
        
        const blob = new Blob([this.outputCode.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `obfuscated_${Date.now()}.lua`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('File berhasil diunduh', 'success');
    }

    toggleSettings(show = null) {
        if (show === null) {
            show = !this.settingsPanel.classList.contains('active');
        }
        
        if (show) {
            this.settingsPanel.classList.add('active');
            this.settingsToggle.classList.add('active');
        } else {
            this.settingsPanel.classList.remove('active');
            this.settingsToggle.classList.remove('active');
        }
    }

    loadExample() {
        const exampleCode = `-- Script Game Roblox Contoh
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local player = Players.LocalPlayer
local leaderstats = player:FindFirstChild("leaderstats")

if not leaderstats then
    leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player
end

local coins = leaderstats:FindFirstChild("Coins")
if not coins then
    coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 100
    coins.Parent = leaderstats
end

local function addCoins(amount)
    if typeof(amount) == "number" and amount > 0 then
        coins.Value = coins.Value + amount
        return true
    end
    return false
end

local function removeCoins(amount)
    if typeof(amount) == "number" and amount > 0 then
        if coins.Value >= amount then
            coins.Value = coins.Value - amount
            return true
        end
    end
    return false
end

-- Event handling
local remoteEvent = ReplicatedStorage:WaitForChild("CoinEvent")

remoteEvent.OnServerEvent:Connect(function(player, action, amount)
    if action == "add" then
        addCoins(amount)
    elseif action == "remove" then
        removeCoins(amount)
    end
end)

print("Coin system initialized for " .. player.Name)`;
        
        this.sourceCode.value = exampleCode;
        this.updateCharCount();
        this.showToast('Contoh kode dimuat', 'info');
    }

    clearInput() {
        this.sourceCode.value = '';
        this.updateCharCount();
        this.showToast('Input dibersihkan', 'info');
    }

    resetSettings() {
        if (!confirm('Reset semua pengaturan ke default?')) return;
        
        // Set default values
        this.enableStringEnc.checked = true;
        this.enableXOR.checked = true;
        this.enableBase64.checked = true;
        this.xorKey.value = '0x5A';
        this.enableConstantEnc.checked = true;
        this.constantMethod.value = 'arithmetic';
        this.enableControlFlow.checked = true;
        this.cfComplexity.value = 'medium';
        this.enableRenaming.checked = true;
        this.renameType.value = 'mixed';
        this.renameObfuscate.checked = true;
        this.enableBytecode.checked = false;
        this.enableVM.checked = false;
        this.vmComplexity.value = 'medium';
        this.enableDeadCode.checked = true;
        this.enableDebugProtection.checked = false;
        this.enableSelfDefending.checked = false;
        this.obfLevel.value = 'medium';
        this.languageType.value = 'luau';
        
        this.updateIndicators();
        this.showToast('Pengaturan direset ke default', 'success');
    }

    saveSettings() {
        const settings = {
            theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light',
            obfuscationSettings: this.getSettings()
        };
        
        localStorage.setItem('ziaanveil_settings', JSON.stringify(settings));
        this.showToast('Pengaturan disimpan', 'success');
    }

    loadSettings() {
        const saved = localStorage.getItem('ziaanveil_settings');
        if (!saved) {
            this.applyObfuscationLevel();
            return;
        }
        
        try {
            const settings = JSON.parse(saved);
            
            // Apply theme
            if (settings.theme === 'dark') {
                document.body.classList.add('dark-mode');
                this.themeIcon.className = 'fas fa-sun';
                this.themeToggle.innerHTML = '<i class="fas fa-sun"></i> Mode Terang';
            }
            
            // Apply obfuscation settings if they exist
            if (settings.obfuscationSettings) {
                const obfSettings = settings.obfuscationSettings;
                
                this.enableStringEnc.checked = obfSettings.stringEncryption !== false;
                this.enableXOR.checked = obfSettings.useXOR !== false;
                this.enableBase64.checked = obfSettings.useBase64 || false;
                this.xorKey.value = obfSettings.xorKey || '0x5A';
                this.enableConstantEnc.checked = obfSettings.constantEncoding !== false;
                this.constantMethod.value = obfSettings.constantMethod || 'arithmetic';
                this.enableControlFlow.checked = obfSettings.controlFlowFlattening !== false;
                this.cfComplexity.value = obfSettings.cfComplexity || 'medium';
                this.enableRenaming.checked = obfSettings.variableRenaming !== false;
                this.renameType.value = obfSettings.renameType || 'mixed';
                this.renameObfuscate.checked = obfSettings.renameObfuscate !== false;
                this.enableBytecode.checked = obfSettings.bytecodeGeneration || false;
                this.enableVM.checked = obfSettings.vmProtection || false;
                this.vmComplexity.value = obfSettings.vmComplexity || 'medium';
                this.enableDeadCode.checked = obfSettings.enableDeadCode || false;
                this.enableDebugProtection.checked = obfSettings.enableDebugProtection || false;
                this.enableSelfDefending.checked = obfSettings.enableSelfDefending || false;
                this.obfLevel.value = obfSettings.obfuscationLevel || 'medium';
                this.languageType.value = obfSettings.languageType || 'luau';
            }
            
            this.updateIndicators();
        } catch (e) {
            console.error('Failed to load settings:', e);
            this.applyObfuscationLevel();
        }
    }

    showToast(message, type = 'info') {
        // Remove existing classes
        this.toast.className = 'toast';
        
        // Add type class
        this.toast.classList.add(type);
        
        // Set message
        this.toast.textContent = message;
        
        // Show toast
        this.toast.classList.add('show');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ZiaanVeilApp();
});
