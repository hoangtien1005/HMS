const serviceService = require("../services/service/service.service");

class ServiceController {
    //[GET] /services/
    async show(req, res, next) {
        const allServices = await serviceService.findAll();
        // console.log(allServices);
        // console.log(allServices);
        // console.log(allServices[0].id);
        res.render("services/services", { allServices: allServices });

        // res.send(allServices);
    }

    async ServiceDetail(req, res, next) {
        const service = await serviceService.findById(req.params.id_service);
        console.log(service);
        res.render("services/service-details", { service: service });
    }
}
module.exports = new ServiceController;