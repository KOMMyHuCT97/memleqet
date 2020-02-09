require("./Gena.js");

createZone = function(type, what) {
    zone = {type:type, isEconomic:false};
    if (type == 'nature') {
      if (what == 0) {
        if (inChanceOf(90)) {
          zone.relief = 0;
        }
        else {
          zone.relief = 1;
        }
      }
      if (what == 1) {
        if (inChanceOf(90)) {
          zone.relief = 1;
        }
        else {
          zone.relief = 0;
        }
      }
      // 0 - немае ресуроу 1 - руда 2 - плодородная земля
      if (inChanceOf(15)) {
        zone.resourceType = 1;
      }
      if (inChanceOf(5)) {
        zone.resourceType = 2;
      }
      if (zone.relief == 0) {
        zone.resourceType = 0;
      }
      // if (zone.resourceType != 0) {
      //   zone.resourceAmount = 100;
      // }
    }
    if (type == 'fields') {
      zone.isEconomic = true
      zone.budget = 100;
      zone.resources = [];
      zone.products = [];
      zone.problems = 0;
      zone.resources.push({type:'workers', neednorm:1, facilyty:1});
      zone.products.push({type:'goods', prodnorm:2, facilyty:0});
    }
    if (type == 'plant') {
      zone.isEconomic = true
      zone.budget = 100;
      zone.resources = [];
      zone.products = [];
      zone.problems = 0;
      zone.resources.push({type:'workers', neednorm:1, facilyty:1});
      zone.resources.push({type:'ores', neednorm:1, facilyty:1});
      zone.products.push({type:'things', prodnorm:3, facilyty:0});
    }
    if (type == 'mine') {
      zone.isEconomic = true
      zone.budget = 100;
      zone.resources = [];
      zone.products = [];
      zone.problems = 0;
      zone.resources.push({type:'workers', neednorm:1, facilyty:1});
      zone.products.push({type:'ores', prodnorm:2, facilyty:0});
    }
    if (type == 'houses') {
      zone.isEconomic = true
      zone.budget = 100;
      zone.resources = [];
      zone.products = [];
      zone.problems = 0;
      zone.resources.push({type:'goods', neednorm:1, facilyty:1});
      zone.resources.push({type:'things', neednorm:1, facilyty:1});
      zone.products.push({type:'workers', prodnorm:3, facilyty:0});
    }
    if (type == 'militia') {
      zone.isEconomic = true
      zone.budget = 100;
      zone.resources = [];
      zone.products = [];
      zone.problems = 0;
      zone.resources.push({type:'goods', neednorm:1, facilyty:1});
      zone.resources.push({type:'things', neednorm:1, facilyty:1});
      zone.resources.push({type:'workers', neednorm:1, facilyty:1});
      //zone.forces.push({type:1, health:100});
    }
    if (type == 'palace') {
      zone.isEconomic = true
      zone.budget = 100;
      zone.resources = [];
      zone.products = [];
      zone.problems = 0;
      zone.resources.push({type:'goods', neednorm:1, facilyty:10});
      zone.resources.push({type:'things', neednorm:1, facilyty:10});
      zone.resources.push({type:'workers', neednorm:1, facilyty:10});
    }
    if (type == 'building') {
      zone.what = what;
      zone.cycles = 2;
    }
    return zone;
}

createRegion = function(x, y, name, owner) {
    region = {x:x, y:y, name:name, type:0, owner:owner, zones:[]};
    for (var i = 0; i < 16; i++) {
        region.zones[i] = [];
        for (var k = 0; k < 16; k++) {
          // КОСТЫЛИНА
            region.zones[i][k] = createZone('nature', chunk[x][y].relief);
        }
    }
    return region;
    //db.regions.insert(region);
}

checkResources = function(zone) {
    for (let resource of zone.resources) {
      if(resource.facilyty < resource.neednorm){
        return false;
      }
    }
  return true;
}

work = function(zone) {

  if (!checkResources(zone)) {
    zone.problems += 1;
  }

  if (checkResources(zone)) {
    for (var i = 0; i < zone.products.length; i++) {
      zone.products[i].facilyty+=zone.products[i].prodnorm;
    }
    for (var i = 0; i < zone.resources.length; i++) {
      zone.resources[i].facilyty-=zone.resources[i].neednorm;
    }
    zone.problems = 0;
    console.log(zone.type + 'worked');
  }
  return zone;
}

findResources = function(zone, region) {
  for (let resource of zone.resources) {
    if(resource.facilyty < resource.neednorm){
      for (var k = 0; k < 16; k++) {
        for (var l = 0; l < 16; l++) {
          if ((region.zones[k][l].type != 'nature')&(region.zones[k][l].type != 'building')) {
            for (let product of region.zones[k][l].products) {
              if ((product.type == resource.type)&(product.facilyty >= resource.neednorm)&(resource.facilyty < resource.neednorm)) {
                console.log('product ' + product.type + ' transported from ' + region.zones[k][l].type + ' to ' + zone.type);
                product.facilyty-=resource.neednorm;
                resource.facilyty+=resource.neednorm;
              }
            }
          }
        }
      }
    }
  }
}

deleteProblemZones = function(region) {
  for (var k = 0; k < 16; k++) {
    for (var l = 0; l < 16; l++) {
      if (region.zones[k][l].problems > 4) {
        region.zones[k][l] = createZone('nature');
        region.zones[k][l].relief = 2;
        region.zones[k][l].resourceType = 0;
      }
    }
  }
}

changeRegionStatus = function(region) {
  let temp = 0;
  for (var k = 0; k < 16; k++) {
    for (var l = 0; l < 16; l++) {
      if (region.zones[k][l].type != 'nature') {
        temp += 1;
      }
    }
  }
  if (temp > 0) {
    region.type = 'village';
  }
  if (temp > 10) {
    region.type = 'city';
  }
}

let chunk = [];
for (var i = 0; i < 16; i++) {
    chunk[i] = [];
    for (var j = 0; j < 16; j++) {
      // 0 1 море и суша 2 город 3 деревня
        //chunk[i][j] = {relief:Math.floor(Math.random()*2), owner:0};
        chunk[i][j] = {relief:0, owner:0};
        if (inChanceOf(5)) {
            chunk[i][j].relief = 1;
            chunk[i][j].owner = 0;
        } else {
            chunk[i][j].relief = 0;
            chunk[i][j].owner = 0;
        }
    }
}

for (var m = 0; m <= 7; m++) {
  for (var i = 1; i < 14; i++) {
      for (var k = 1; k < 14; k++) {
          if (chunk[i][k].relief == 1) {
              chunk[i + randToward()][k + randToward()].relief = 1;
          }
      }
  }
}

//console.log(world1);
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
// база данных
//var mongojs = require("mongojs");
//var db = mongojs('localhost:27017/myDb', ['regions']);

server.listen(3000);
connections = [];

app.get('/', function(request, respons) {
	respons.sendFile(__dirname + '/client/arcade_client.html');
});
app.use('/client', express.static(__dirname + '/client'))

io.sockets.on('connection', function(socket) {
	console.log("Успешное соединение");
	connections.push(socket);

	socket.on('disconnect', function(data) {
		connections.splice(connections.indexOf(socket), 1);
		console.log("Отключились");
	});

	socket.on('world', function(data) {
		socket.emit('worldResponce', chunk);
		console.log("ask for world");
	});

	socket.on('send msg', function(data) {
		io.sockets.emit('add msg', {message:data.message, name:data.name});
	});

	socket.on('signin', function(data) {
		socket.emit('signinResponce', {success:true});
    //инициализация столицы
    capx = Math.floor(Math.random()*14) + 1;
    capy = Math.floor(Math.random()*14) + 1;
    chunk[capx][capy] = createRegion(capx, capy, 'Столица', data.name);
    chunk[capx][capy].type = 'city';
    chunk[capx-1][capy] = createRegion(capx-1, capy, 'testname', data.name);
    chunk[capx-1][capy-1] = createRegion(capx-1, capy-1, 'testname', data.name);
    chunk[capx-1][capy+1] = createRegion(capx-1, capy+1, 'testname', data.name);
    chunk[capx][capy-1] = createRegion(capx, capy-1, 'testname', data.name);
    chunk[capx][capy+1] = createRegion(capx, capy+1, 'testname', data.name);
    chunk[capx+1][capy] = createRegion(capx+1, capy, 'testname', data.name);
    chunk[capx+1][capy-1] = createRegion(capx+1, capy-1, 'testname', data.name);
    chunk[capx+1][capy+1] = createRegion(capx+1, capy+1, 'testname', data.name);
    chunk[capx][capy].zones[Math.floor(Math.random()*15)][Math.floor(Math.random()*15)] = createZone('palace');
	});

  socket.on('goToRegion', function(data) {
    if (chunk[data.x][data.y].owner == 0) {
      chunk[data.x][data.y] = createRegion(data.x, data.y, 'testname', data.user)
    }
		socket.emit('goToRegionResponce', chunk[data.x][data.y]);
	});

  socket.on('newBuild', function(data) {
    //chunk[data.regX][data.regY].zones[data.x][data.y] = createZone(data.type);
    chunk[data.regX][data.regY].zones[data.x][data.y] = createZone('building', data.type);
	});

  socket.on('step', function(data) {
    console.log('step');
    for (var i = 0; i < 16; i++) {
      for (var j = 0; j < 16; j++) {
        //общерегиональные операции
        if (chunk[i][j].owner != 0) {
          deleteProblemZones(chunk[i][j]);
          //преобразование в деревню и город
          changeRegionStatus(chunk[i][j]);
        }
        //работа
        for (var k = 0; k < 16; k++) {
          for (var l = 0; l < 16; l++) {
            if (chunk[i][j].owner != 0) {
              if ((chunk[i][j].zones[k][l].type != 'nature')&(chunk[i][j].zones[k][l].type != 'building')) {
                chunk[i][j].zones[k][l] = work(chunk[i][j].zones[k][l]);
              }
                //строительство
              if (chunk[i][j].zones[k][l].type == 'building') {
                chunk[i][j].zones[k][l].cycles -= 1;
                if (chunk[i][j].zones[k][l].cycles < 1) {
                  //console.log(chunk[i][j].zones[k][l].cycles);
                  chunk[i][j].zones[k][l] = createZone(chunk[i][j].zones[k][l].what);
                }
              }


            }
          }
        }
        //поиск ресурсов
        for (var k = 0; k < 16; k++) {
          for (var l = 0; l < 16; l++) {
            if (chunk[i][j].owner != 0) {
              if ((chunk[i][j].zones[k][l].type != 'nature')&(chunk[i][j].zones[k][l].type != 'building')) {
                findResources(chunk[i][j].zones[k][l], chunk[i][j]);
              }
            }
          }
        }
      }
    }
  });

});
