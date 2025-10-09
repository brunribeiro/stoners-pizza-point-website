import { withSessionRoute } from '../../lib/withSession';

async function getStoreID(request, response) {
  response.send({ ok: true, restInfo: request.session.id || {} });
}

export default withSessionRoute(getStoreID);
