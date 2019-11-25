import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number().required(),
      peso: Yup.number().required(),
      altura: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha na validação dos campos do estudante.' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res
        .status(400)
        .json({ error: 'E-mail do estudante já cadastrado. Tente outro!' });
    }

    const { id, name, email, idade, peso, altura } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      idade,
      peso,
      altura,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
      newEmail: Yup.string(),
      idade: Yup.number(),
      peso: Yup.number(),
      altura: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Falha na validação dos campos. E-mail é necessário.' });
    }

    const { email, newEmail } = req.body;

    const student = await Student.findOne({
      where: { email },
    });

    if (!student) {
      return res.status(400).json({ error: 'Estudante não encontrado!' });
    }

    if (newEmail) {
      const studentExists = await Student.findOne({
        where: { email: newEmail },
      });

      if (studentExists) {
        return res
          .status(400)
          .json({ error: 'E-mail já usado por outro estudante. Tente outro!' });
      }
      req.body.email = newEmail;
    }

    const { id, name, idade, peso, altura } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
      newEmail,
      idade,
      peso,
      altura,
    });
  }
}

export default new StudentController();
