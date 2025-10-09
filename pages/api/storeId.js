import { withSessionRoute } from '../../lib/withSession';

async function storeId(request, response) {
  request.session.id = request.body.id;
  await request.session.save();
  response.send({ ok: true, ...request.session });
}

export default withSessionRoute(storeId);
