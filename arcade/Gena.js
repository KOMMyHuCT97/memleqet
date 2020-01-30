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
