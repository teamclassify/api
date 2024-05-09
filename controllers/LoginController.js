const UserService = require("../services/UserService");
const RolService = require("../services/RolService");
const models = require("../db/models");

const service = new UserService();
const rolService = new RolService();

const login = async (req, res) => {
  // TODO: check body

  try {
    return service.findOne(req.uid).then((user) => {
      if (!user) {
        return service
          .create({ ...req.body, id: req.uid, codigo: "" })
          .then((userCreated) => {
            return models.UsuarioRol.create({
              rol_id: 1,
              usuario_id: req.uid,
            }).then((usuarioRol) => {
              return rolService.findOne(usuarioRol.rol_id).then((rol) => {
                return res.status(200).json({
                  success: true,
                  data: {
                    id: userCreated.id,
                    roles: [rol.nombre],
                    nombre: userCreated.nombre,
                    codigo: userCreated.codigo,
                    correo: userCreated.correo,
                    createdAt: userCreated.createdAt,
                    updatedAt: userCreated.updatedAt,
                  },
                });
              });
            });
          });
      } else {
        return models.UsuarioRol.findOne({
          where: { usuario_id: req.uid },
        }).then((usuarioRol) => {
          return rolService.findOne(usuarioRol.rol_id).then((rol) => {
            return res.status(200).json({
              success: true,
              data: {
                id: user.id,
                roles: [rol.nombre],
                nombre: user.nombre,
                codigo: user.codigo,
                correo: user.correo,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
              },
            });
          });
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "No auth" });
  }
};

const me = async (req, res) => {
  try {
    res.status(200).json({ uid: req.uid });
  } catch (error) {
    res.status(500).json({ success: false, message: "No auth" });
  }
};

module.exports = {
  login,
  me,
};
