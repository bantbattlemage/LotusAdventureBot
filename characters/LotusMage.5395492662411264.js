//load_file("C:/GitHub/lotusAdventureBot/characters/LotusMage.5395492662411264.js");

let EnergizeRotation = ["LotusRanger", "RangerLotus"];
let EnergizeTick = 0;

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
	return castEnergize();
}

function castEnergize()
{
	if (is_on_cooldown("energize"))
	{
		return false;
	}

	let energizeTarget = null;

	for (let i = 0; i < EnergizeRotation.length; i++)
	{
		energizeTarget = parent.entities[EnergizeRotation[EnergizeTick]];
		EnergizeTick++;
		if (EnergizeTick >= EnergizeRotation.length)
		{
			EnergizeTick = 0;
		}

		if (energizeTarget != null)
		{
			break;
		}
	}

	if (energizeTarget === null)
	{
		return false;
    }

	if (energizeTarget && !energizeTarget.s.energized && is_in_range(energizeTarget, "energize"))
	{
		use_skill("energize", energizeTarget);
		reduce_cooldown("energize", character.ping);

		return true;
	}

	return false;
}