const Sequelize = require('sequelize');

const getContractById = async (req, res) => {
    const {Contract} = req.app.get('models')
    const { id } = req.params
    const profile = req.profile;
    const contract = await Contract.findOne({
        where: {
            id,
            [Sequelize.Op.or]: [
                { ContractorId: profile.id },
                { ClientId: profile.id }
            ]
        }
    })
    if(!contract) return res.status(404).end()
    res.json(contract)
}

const getAllContracts =  async (req, res) => {
    const profile = req.profile;
    const {Contract} = req.app.get('models')
    const contracts = await Contract.findAll({
        where: {
            [Sequelize.Op.or]: [
                { ContractorId: profile.id },
                { ClientId: profile.id }
            ],
        status: { [Sequelize.Op.ne]: 'terminated' }
        }
    });

    res.json(contracts);
};

module.exports = {
    getContractById,
    getAllContracts
}