//load_file("C:/GitHub/lotusAdventureBot/characters/LotusMage.5395492662411264.js");

function loadCharacter()
{
	let settings =
	{
		"FarmMap": "main",
		"FarmMonster": "crabx",
		"FarmSpawn": 5,
		"PriorityTargets": ["phoenix","goldenbat"],
		"Party": ["LotusRanger", "RangerLotus", "LotusMage", "LotusMerch"],
		"TetherRadius": 100,
		"VendorTrash": VendorTrash
	};

	startBotCore(settings);
	Flags["Farming"] = true;
}

function characterCombat()
{

}