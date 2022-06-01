// thanks, https://iquilezles.org/articles/warp/
function warp(x, y, seed, w_octaves = 1, f_octaves = 1) {
    let x_warp = 0
    let y_warp = 0

    for(let i = 0; i < w_octaves; i++) {
        x_warp = fractal(
            x + x_warp * skew_scale * generation_scale + warp_rands[i + 0],
            y + y_warp * skew_scale * generation_scale + warp_rands[i + 1],
            seed,
            f_octaves
        )
        y_warp = fractal(
            x + x_warp * skew_scale * generation_scale + warp_rands[i + 2],
            y + y_warp * skew_scale * generation_scale + warp_rands[i + 3],
            seed,
            f_octaves
        )
    }
    
    return fractal(
        x + x_warp * skew_scale * generation_scale,
        y + y_warp * skew_scale * generation_scale,
        seed,
        f_octaves
    )
}

function fractal(x, y, seed, octaves = 1) {
    let value = 0

    for(let i = 1; i <= octaves; i++) {
        const scale     = (i * i) / generation_scale
        const weight    = 1 / (i * i) // maximum precision is 16 because of this

        noise.seed(i)
        value += noise.simplex3(x * scale, y * scale, seed) * weight
    }

    return value
}

function convert(value) {
    const out = ((value + 1) / 2) * 255

    return Math.min(Math.max(parseInt(out), 0), 255)
}

async function draw() {
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            const img = ctx.createImageData(1, 1)
            const val = convert(warp(x, y, seed, warp_octaves, fractal_octaves))
            img.data[0] = val
            img.data[1] = val
            img.data[2] = val
            img.data[3] = 255
            ctx.putImageData(img, x, y)
        }
        // forces canvas to display each line as it's generated
        await new Promise(r => setTimeout(r, 0))
    }
    console.log("done")
}

window.onload = () => {
    canvas  = document.getElementsByTagName("canvas")[0]
    ctx     = canvas.getContext("2d")

    canvas.width    = width
    canvas.height   = height

    setTimeout(draw, 10) // prevents "this website has slowed down your browser"
}

width               = 250
height              = 250
generation_scale    = 100
skew_scale          = 30
warp_octaves        = 5
fractal_octaves     = 8
seed                = parseInt(Math.random() * 65536)

warp_rands = []
for(i = 0; i < 64; i ++) {
    warp_rands[i] = ((Math.random() - 0.5) * 2) * 10
}
