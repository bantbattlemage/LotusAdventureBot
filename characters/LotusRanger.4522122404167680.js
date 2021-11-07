//load_file("C:/GitHub/lotusAdventureBot/characters/LotusRanger.4522122404167680.js");

function loadCharacter()
{
	let settings =
	{
		"FarmMap": "main",
		"FarmMonster": "crabx",
		"FarmSpawn": 5,
		//"FarmMap": "tunnel",
		//"FarmMonster": "mole",
		//"FarmSpawn": 8,
		"PriorityTargets": ["phoenix", "goldenbat"],
		//"Avoid": ["bigbird"],
		"Avoid": ["bigbird", "mole"],
		"Party":["LotusRanger","RangerLotus","LotusMage","LotusMerch"],
		"TetherRadius": 100,
		"VendorTrash": VendorTrash
	};

	startBotCore(settings);
	load_code("RangerLotus");
	Flags["Farming"] = true;
/*	Flags["Kiting"] = true;*/
}