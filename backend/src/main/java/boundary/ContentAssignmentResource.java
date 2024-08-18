package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.ContentAssignment;
import repository.ContentAssignmentRepository;

import java.util.List;

@Path("videoAssignment")
public class ContentAssignmentResource {
    @Inject
    ContentAssignmentRepository contentAssignmentRepository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createVideoAssignment(ContentAssignment contentAssignment){
        try {
            contentAssignmentRepository.create(contentAssignment);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll() {
        List<ContentAssignment> contentAssignments;
        try {
            contentAssignments = contentAssignmentRepository.getAll();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(contentAssignments).build();
    }

    @GET
    @Path("{id: [0-9]+}")
    public Response getVideoAssignment(@PathParam("id") Long id){
        ContentAssignment contentAssignment;
        try{
            contentAssignment = contentAssignmentRepository.getById(id);
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(contentAssignment).build();
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteVideoAssignment(@PathParam("id") Long id){
        try{
            contentAssignmentRepository.delete(id);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Path("{id: [0-9]+}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateVideoAssignment(@PathParam("id") Long id, ContentAssignment contentAssignment){
        try{
            contentAssignmentRepository.update(contentAssignment);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

}
