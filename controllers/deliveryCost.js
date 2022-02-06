const DeliveryCost = require('../models/DeliveryCost')
module.exports.getDeliveryCost = async function (req, res) {
    try {
        const deliveryCost = await DeliveryCost.findOne()
        res.json(deliveryCost)
    } catch (e) {
        console.log(e);
    }
}

module.exports.setDeliveryCost = async function (req, res) {
    try {
        let deliveryCost = await DeliveryCost.findOne()
        if (deliveryCost) {
            const updated = {
                cost: req.body.deliveryCost,
            }
            const UpdatedDeliveryCost = await DeliveryCost.findByIdAndUpdate(
                { _id:deliveryCost._id },
                { $set: updated },
                { new: true })
            res.json(UpdatedDeliveryCost)
        } else {
            deliveryCost = new DeliveryCost({
                cost: req.body.deliveryCost
            })
            await deliveryCost.save()
            res.json(deliveryCost)
        }
    } catch (e) {
        console.log(e);
    }
}