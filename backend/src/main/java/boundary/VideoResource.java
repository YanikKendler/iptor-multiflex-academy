package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Video;
import repository.VideoRepository;

import java.util.List;

@Path("video")
public class VideoResource {
    @Inject
    VideoRepository repository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createDevice(Video v){
        try {
            repository.create(v);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(){
        List<Video> videos;
        try{
            videos = repository.getAll();
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(videos).build();
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteDevice(@PathParam("id") Long id){
        try{
            repository.delete(id);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Path("{id: [0-9]+}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateDevice(@PathParam("id") Long id, Video v){
        try{
            repository.update(v);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
