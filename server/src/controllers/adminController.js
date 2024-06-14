const Sequelize = require('sequelize');

const { sequelize } = require('../model')

const bestProfession = async (req, res) => {
    const { start, end } = req.query;
    const { Job, Contract, Profile } = req.app.get('models');
    const bestProfession = await Job.findAll({
        attributes: [
        'Contract.Contractor.profession',
        [sequelize.fn('sum', sequelize.col('price')), 'total_earned']
        ],
        include: {
        model: Contract,
        include: {
            model: Profile,
            as: 'Contractor'
        }
        },
        where: {
        paid: true,
        paymentDate: { [Sequelize.Op.between]: [new Date(start), new Date(end)] }
        },
        group: ['Contract.Contractor.profession'],
        order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
        limit: 1
    });

    res.json(bestProfession);
}

const bestClients = async (req, res) => {
    const { start, end, limit = 2 } = req.query;
    const { Job, Contract, Profile } = req.app.get('models');
    const bestClients = await Job.findAll({
        attributes: [
        'Contract.Client.id',
        [sequelize.literal("firstName || ' ' || lastName"), 'fullName'],
        [sequelize.fn('sum', sequelize.col('price')), 'paid']
        ],
        include: {
        model: Contract,
        include: {
            model: Profile,
            as: 'Client'
        }
        },
        where: {
        paid: true,
        paymentDate: { [Sequelize.Op.between]: [new Date(start), new Date(end)] }
        },
        group: ['Contract.Client.id'],
        order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
        limit: parseInt(limit, 10)
    });

    res.json(bestClients);
}

module.exports = {
    bestProfession,
    bestClients
}