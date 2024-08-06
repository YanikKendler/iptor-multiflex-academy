package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.VideoAssignment;
import repository.VideoAssignmentRepository;

import java.util.List;

@Path("videoAssignment")
public class VideoAssignmentResource {
    @Inject
    VideoAssignmentRepository videoAssignmentRepository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createVideoAssignment(VideoAssignment videoAssignment){
        try {
            videoAssignmentRepository.create(videoAssignment);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll() {
        List<VideoAssignment> videoAssignments;
        try {
            videoAssignments = videoAssignmentRepository.getAll();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(videoAssignments).build();
    }

    @GET
    @Path("{id: [0-9]+}")
    public Response getVideoAssignment(@PathParam("id") Long id){
        VideoAssignment videoAssignment;
        try{
            videoAssignment = videoAssignmentRepository.getById(id);
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(videoAssignment).build();
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteVideoAssignment(@PathParam("id") Long id){
        try{
            videoAssignmentRepository.delete(id);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Path("{id: [0-9]+}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateVideoAssignment(@PathParam("id") Long id, VideoAssignment videoAssignment){
        try{
            videoAssignmentRepository.update(videoAssignment);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

}
