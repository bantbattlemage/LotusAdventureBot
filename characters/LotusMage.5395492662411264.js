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

function characterCombat(target)
{
	if (castEnergize())
	{
		return true;
	}

	if (castScare(target))
	{
		return true;
	}

	return false;
}

function castScare(target)
{
	if (character.mp < G.skills.scare.mp || is_on_cooldown("scare") || !is_in_range(target, "scare") || !target)
	{
		return false;
	}

	use_skill("scare", target);
	reduce_cooldown("scare", character.ping);

	return true;
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