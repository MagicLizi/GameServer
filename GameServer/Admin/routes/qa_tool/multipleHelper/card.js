/**
 * Created by David_shen on 7/4/14.
 */
module.exports = card;

function card(opts) {
    if(!opts)
    {
        this.number = 0;
        this.cardMark = 0;
    }
    else
    {
        this.number = opts.number;
        this.cardMark = opts.cardMark;
    }
    this.isBlack = false;
    this.oriIndex = -1;
}
