local function SafeGet(url)
    local ok, result = pcall(function()
        return game:HttpGet(url)
    end)
    return ok and result or nil
end

local data = SafeGet("https://vexusware.github.io/src/vexus/vexusware.lua")
if not data then return end

local Games = loadstring(data)()
if type(Games) ~= "table" then return end

local URL = Games[game.PlaceId]
if URL then
    local scriptData = SafeGet(URL)
    if scriptData then
        loadstring(scriptData)()
    end
end
