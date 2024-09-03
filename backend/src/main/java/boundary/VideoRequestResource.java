package boundary;

import dtos.VideoRequestDTO;
import enums.VideoRequestEnum;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import repository.VideoRequestRepository;

@Path("/video/request")
public class VideoRequestResource {
    @Inject
    VideoRequestRepository repository;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllRequests(){
        try{
            return Response.ok(repository.getAll()).build();
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createRequest(VideoRequestDTO videoRequestDTO){
        try{
            repository.createVideoRequest(videoRequestDTO);
            return Response.ok().build();
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{requestId}/status/{status}")
    public Response setStatus(@PathParam("requestId") Long requestId, @PathParam("status") VideoRequestEnum status,
                              @QueryParam("userId") Long userId, @QueryParam("videoId") Long videoId){
        try{
            repository.setStatus(requestId, userId, status, videoId);
            return Response.ok().build();
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
    }
}
