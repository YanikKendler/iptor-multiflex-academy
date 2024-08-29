package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Notification;
import repository.NotificationRepository;

import java.util.List;

@Path("notification")
public class NotificationResource {
    @Inject
    NotificationRepository notificationRepository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createNotification(Notification notification){
        try {
            notificationRepository.create(notification);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@QueryParam("userId") Long userId){
        List<Notification> notificationList;
        try{
            notificationList = notificationRepository.getAll(userId);
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(notificationList).build();
    }

    @GET
    @Path("{id: [0-9]+}")
    public Response getNotification(@PathParam("id") Long id){
        Notification notification;
        try{
            notification = notificationRepository.getById(id);
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(notification).build();
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteNotification(@PathParam("id") Long id){
        try{
            notificationRepository.delete(id);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateNotification(Notification notification){
        try{
            notificationRepository.update(notification);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Path("done/{id: [0-9]+}/{done}")
    public Response setDone(@PathParam("id") Long id, @PathParam("done") boolean done){
        try{
            Notification notification = notificationRepository.getById(id);
            notification.setDone(done);
            notificationRepository.update(notification);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
