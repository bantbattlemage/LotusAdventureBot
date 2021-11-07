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
		"TetherRadius": 100,
		"VendorTrash": VendorTrash
	};

	Flags["Farming"] = true;
	Flags["Kiting"] = false;

	if (parent.caracAL)
	{
		parent.caracAL.load_scripts(["characters/RangerLotus.6290619425619968.js"]).then(() =>
		{
			startBotCore(settings);
		});
	}
	else
	{
		startBotCore(settings);
		load_code("RangerLotus");
    }
}