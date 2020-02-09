inChanceOf = function(percent) {
    temp = false;
    rnd = Math.round(Math.random()*100);
    if (rnd <= percent) {
        temp = true;
    }
    return temp;
}

randToward = function() {
    rnd = Math.round(Math.random()*2) - 1;
    return rnd;
}

buildNaturalZone = function(relief) {
  zone = {};
  zone.type = 'nature';
  zone.isEconomic = false;
  zone.isBuilding = false;
  // старый генератор
  if (relief == 0) {
    if (inChanceOf(90)) {
      zone.relief = 0;
    }
    else {
      zone.relief = 1;
    }
  }
  if (relief == 1) {
    if (inChanceOf(90)) {
      zone.relief = 1;
    }
    else {
      zone.relief = 0;
    }
  }
  if (inChanceOf(15)) {
    zone.resourceType = 1;
  }
  if (inChanceOf(5)) {
    zone.resourceType = 2;
  }
  if (zone.relief == 0) {
    zone.resourceType = 0;
  }
  return zone;
}

buildEconomicZone = function(naturalZone, type) {
    zone = naturalZone;
    zone.type = type;
    zone.isEconomic = true;
    zone.isBuilding = true;
    zone.buildCycles = 2;
    zone.budget = 100;
    zone.resources = [];
    zone.products = [];
    zone.problems = 0;

    if (type == 'fields') {
      zone.resources.push({type:'workers', neednorm:1, facilyty:1});
      zone.products.push({type:'goods', prodnorm:2, facilyty:0});
    }
    if (type == 'plant') {
      zone.resources.push({type:'workers', neednorm:1, facilyty:1});
      zone.resources.push({type:'ores', neednorm:1, facilyty:1});
      zone.products.push({type:'things', prodnorm:3, facilyty:0});
    }
    if (type == 'mine') {
      zone.resources.push({type:'workers', neednorm:1, facilyty:1});
      zone.products.push({type:'ores', prodnorm:2, facilyty:0});
    }
    if (type == 'houses') {
      zone.resources.push({type:'goods', neednorm:1, facilyty:1});
      zone.resources.push({type:'things', neednorm:1, facilyty:1});
      zone.products.push({type:'workers', prodnorm:3, facilyty:0});
    }
    if (type == 'militia') {
      zone.resources.push({type:'goods', neednorm:1, facilyty:1});
      zone.resources.push({type:'things', neednorm:1, facilyty:1});
      zone.resources.push({type:'workers', neednorm:1, facilyty:1});
      //zone.forces.push({type:1, health:100});
    }
    if (type == 'palace') {
      zone.resources.push({type:'goods', neednorm:1, facilyty:10});
      zone.resources.push({type:'things', neednorm:1, facilyty:10});
      zone.resources.push({type:'workers', neednorm:1, facilyty:10});
    }
    return zone;
}
