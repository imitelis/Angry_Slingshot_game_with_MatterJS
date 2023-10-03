const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const engine = Matter.Engine.create();

let render = Matter.Render.create({
    element: document.body,
    canvas: canvas,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        pixelRatio: window.devicePixelRatio
    }
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    Matter.Engine.run(engine);
    Matter.Render.run(render);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let table = Matter.Bodies.rectangle(1200, 580, 300, 20, { isStatic: true });
let ground = Matter.Bodies.rectangle(canvas.width/2, canvas.height -10, canvas.width, 20, { isStatic: true });

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        render: {visible: false}
    }
});
render.mouse = mouse;

let ball = Matter.Bodies.circle(300, 400, 20);
let sling = Matter.Constraint.create({
    pointA: { x: 300, y: 400 },
    bodyB: ball,
    stiffness: 0.05
})

let firing = false;
Matter.Events.on(mouseConstraint, 'enddrag', function(e){
    if (e.body === ball) firing = true;
});

Matter.Events.on(engine, 'afterUpdate', function(){
    if (firing && Math.abs(ball.position.x - 300) < 20 && Math.abs(ball.position.y - 400) < 20) {
        ball = Matter.Bodies.circle(300, 400, 20);
        Matter.World.add(engine.world, ball);
        sling.bodyB = ball;
        firing = false;
    }
});

const stack = Matter.Composites.stack(1100, 0, 4, 8, 0, 0, function(x,y){
    // let sides = Math.round(Matter.Common.random(2, 8));
    return Matter.Bodies.polygon(x, y, 12, 30);
})

Matter.World.add(engine.world, [ball, sling, stack, table, ground, mouseConstraint]);
Matter.Engine.run(engine);
Matter.Render.run(render);
