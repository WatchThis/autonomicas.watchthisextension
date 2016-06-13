function find_tv3_stream() {
    // TV3 has a stream for Catalonia, another one for Spain and an international one.
    // Regional streams are geo-restricted and return 401 when the requesting IP is
    // not in the corresponding area.
    var make_url = function(r) {
        return "http://ccma-tva-" + r + "-abertis-live.hls.adaptive.level3.net/" + r + "/ngrp:tv3_web/playlist.m3u8";
    }
    var regions = ["cat", "es", "int"];
    var reqs = [];
    for (var ii = 0; ii < regions.length; ii++) {
        var r = regions[ii];
        var p = fetch(make_url(r)).then(function(resp) {
            if (resp.ok) {
                return r
            }
            return false;
        }).catch(function(err) {
            return false
        });
        reqs.push(p);
    }
    return Promise.all(reqs).then(function(values) {
        if (values) {
            for (var ii = 0; ii < values.length; ii++) {
                if (typeof values[ii] === "string") {
                    return make_url(values[ii]);
                }
            }
        }
        throw "No stream found";
    });
}

function channels(req) {
    var data = [
        ["Andalucía TV", "andaluciatv.png", "http://iphone-andaluciatelevision.rtva.stream.flumotion.com/rtva/andaluciatelevision-iphone-multi/main.m3u8"],
        ["Canal Extremadura", "extremadura.png", "http://corporacionextremena-live.hls.adaptive.level3.net/hls-live/corporacionextremena-channel02/_definst_/live.m3u8"],
        ["CYL7", "cyl7.png", "rtmp://cdn.s1.eu.nice264.com:1935/niceLiveServer/cyl_cyltvlivem_MB_698"],
        ["ETB", "etb.png", "http://etbvhlsnogeo-lh.akamaihd.net/i/ETBEITBEUS_1@123113/master.m3u8"],
        ["IB3", "ib3.png", "http://ibsatiphone.ib3tv.com/iphoneliveIB3/IB3/IB3.m3u8"],
        ["Telemadrid", "telemadrid.png", "http://telemadrid-live.hls.adaptive.level3.net/hls-live/telemadrid-telemadrid/_definst_/live/stream1.m3u8"],
        ["TPA", "tpa.png", "http://iphone.rtpa.stream.flumotion.com/rtpa/tv-iphone/main.m3u8"],
        ["TV3", "tv3.png", find_tv3_stream],
        ["TVR", "tvr.png", "http://teledifusion.tv:1935/rioja/rioja/playlist.m3u8"],
        ["TVG", "tvg.png", "http://media3.crtvg.es/live/tvge/playlist.m3u8"],
        ["TV Mediterráneo", "tvm.png", "http://streaming.enetres.net/489DDF7FE98241D19D8970314BC9D3EF021/smil:live.smil/master.m3u8"],
    ];
    var channels = [];
    for (var ii = 0; ii < data.length; ii++) {
        var item = data[ii];
        channels.push({
            title: item[0],
            country: "es",
            image: item[1],
            background_color: "#fff",
            content_url: item[2],
        });
    }
    req.reply(channels);
}
