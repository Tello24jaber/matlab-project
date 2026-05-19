% =========================================================================
% Project: Modeling Malware Spread in a Network and
%          Solving Traffic Flow Using Linear Algebra
% =========================================================================
% This project has two parts:
%   PART 1 - Malware spread in a 10-node network using graph reachability
%   PART 2 - Traffic flow analysis using a system of linear equations
% =========================================================================

clear;   % Clear all variables from the workspace
clc;     % Clear the command window


% =========================================================================
%                          PART 1: MALWARE SPREAD
% =========================================================================

fprintf('=================================================================\n');
fprintf('           PART 1: Malware Spread in a Network                  \n');
fprintf('=================================================================\n\n');

% -----------------------------------------------------------------------
% Step 1: Build the adjacency matrix A for the 10-node network
%
% The 10 nodes represent routers/servers: S1, S2, S3, ..., S10
% An entry A(i,j) = 1 means there is a direct connection between Si and Sj
% The network is undirected so A(i,j) = A(j,i) always
%
% Edge list:
%   S1-S2,  S2-S4,  S2-S6,  S3-S4,  S3-S5
%   S4-S5,  S4-S9,  S6-S7,  S7-S8,  S7-S9,  S9-S10
% -----------------------------------------------------------------------

% Start with a 10x10 matrix of all zeros
A = zeros(10, 10);

% Now fill in the edges one by one (both directions since undirected)
% Edge S1 - S2
A(1,2) = 1;   A(2,1) = 1;

% Edge S2 - S4
A(2,4) = 1;   A(4,2) = 1;

% Edge S2 - S6
A(2,6) = 1;   A(6,2) = 1;

% Edge S3 - S4
A(3,4) = 1;   A(4,3) = 1;

% Edge S3 - S5
A(3,5) = 1;   A(5,3) = 1;

% Edge S4 - S5
A(4,5) = 1;   A(5,4) = 1;

% Edge S4 - S9
A(4,9) = 1;   A(9,4) = 1;

% Edge S6 - S7
A(6,7) = 1;   A(7,6) = 1;

% Edge S7 - S8
A(7,8) = 1;   A(8,7) = 1;

% Edge S7 - S9
A(7,9) = 1;   A(9,7) = 1;

% Edge S9 - S10
A(9,10) = 1;  A(10,9) = 1;

% -----------------------------------------------------------------------
% Step 2: Display the adjacency matrix
% -----------------------------------------------------------------------
fprintf('Adjacency Matrix A (rows and columns = S1 to S10):\n\n');
fprintf('     S1  S2  S3  S4  S5  S6  S7  S8  S9 S10\n');
for i = 1 : 10
    fprintf('S%2d  ', i);
    for j = 1 : 10
        fprintf('%2d  ', A(i,j));
    end
    fprintf('\n');
end
fprintf('\n');

% -----------------------------------------------------------------------
% Step 3: Ask the user to enter the malware contact level k
% -----------------------------------------------------------------------
k = input('Enter the malware contact level k (positive integer, e.g. 2): ');

% -----------------------------------------------------------------------
% Step 4: Call the KHopReachability function
% -----------------------------------------------------------------------
[riskCounts, riskNodes, mostCritical, mostVulnerable, reachabilityMatrix] = KHopReachability(A, k);

% -----------------------------------------------------------------------
% Step 5: Display the reachability matrix
% -----------------------------------------------------------------------
fprintf('\nReachability Matrix (within %d hop(s)):\n', k);
fprintf('Entry (i,j) = 1 means router i can spread malware to router j\n\n');
fprintf('     S1  S2  S3  S4  S5  S6  S7  S8  S9 S10\n');
for i = 1 : 10
    fprintf('S%2d  ', i);
    for j = 1 : 10
        fprintf('%2d  ', reachabilityMatrix(i,j));
    end
    fprintf('\n');
end
fprintf('\n');

% -----------------------------------------------------------------------
% Step 6: For each router, display which routers are at risk and how many
% -----------------------------------------------------------------------
fprintf('--- Risk Summary for Each Router (k = %d hop(s)) ---\n\n', k);

for i = 1 : 10
    fprintf('Router S%d can spread malware to %d router(s): ', i, riskCounts(i));
    if riskCounts(i) == 0
        fprintf('none');
    else
        % Print each reachable router separated by commas
        reachable = riskNodes{i};
        for idx = 1 : length(reachable)
            if idx < length(reachable)
                fprintf('S%d, ', reachable(idx));
            else
                fprintf('S%d', reachable(idx));
            end
        end
    end
    fprintf('\n');
end

fprintf('\n');

% -----------------------------------------------------------------------
% Step 7: Display the most critical and most vulnerable routers
% -----------------------------------------------------------------------
fprintf('--- Key Findings ---\n\n');

fprintf('Most Critical Router : S%d\n', mostCritical);
fprintf('  --> If S%d gets infected, malware can spread to %d other router(s) within %d hop(s).\n\n', ...
        mostCritical, riskCounts(mostCritical), k);

fprintf('Most Vulnerable Router: S%d\n', mostVulnerable);
fprintf('  --> S%d can be reached by the greatest number of other routers within %d hop(s).\n\n', ...
        mostVulnerable, k);


% =========================================================================
%                        PART 2: TRAFFIC FLOW
% =========================================================================

fprintf('=================================================================\n');
fprintf('           PART 2: Traffic Flow Analysis                        \n');
fprintf('=================================================================\n\n');

% -----------------------------------------------------------------------
% Step 1: Define the traffic inflow and outflow values
%
% u1, u2, u3, u4 are the known net flows at each intersection
% -----------------------------------------------------------------------
u1 = 250;   % Flow entering/leaving at intersection 1
u2 = 200;   % Flow entering/leaving at intersection 2
u3 = 150;   % Flow entering/leaving at intersection 3
u4 = 300;   % Flow entering/leaving at intersection 4

fprintf('Known traffic values:\n');
fprintf('  u1 = %d\n', u1);
fprintf('  u2 = %d\n', u2);
fprintf('  u3 = %d\n', u3);
fprintf('  u4 = %d\n\n', u4);

% -----------------------------------------------------------------------
% Step 2: Display the system of equations
%
% The traffic balance at each intersection gives us these equations:
%   x1 + x2       = u1  (= 250)
%   x1      - x3  = u3  (= 150)
%      -x2  + x4  = u2  (= 200)
%        x3 + x4  = u4  (= 300)
% -----------------------------------------------------------------------
fprintf('System of linear equations (traffic balance at each intersection):\n\n');
fprintf('  x1 + x2           = %d\n', u1);
fprintf('  x1       - x3     = %d\n', u3);
fprintf('       -x2      + x4 = %d\n', u2);
fprintf('            x3 + x4 = %d\n\n', u4);

% -----------------------------------------------------------------------
% Step 3: Display the coefficient matrix and augmented matrix
% -----------------------------------------------------------------------

% Coefficient matrix: each row is the coefficients of [x1, x2, x3, x4]
coeffMatrix = [ 1,  1,  0,  0 ;
                1,  0, -1,  0 ;
                0, -1,  0,  1 ;
                0,  0,  1,  1 ];

% Right-hand side vector
rhs = [u1; u3; u2; u4];

% Augmented matrix = coefficient matrix with rhs column added on the right
augMatrix = [coeffMatrix, rhs];

fprintf('Coefficient Matrix:\n');
for i = 1 : 4
    fprintf('  ');
    for j = 1 : 4
        fprintf('%3d  ', coeffMatrix(i,j));
    end
    fprintf('\n');
end
fprintf('\n');

fprintf('Augmented Matrix [A | b]:\n');
for i = 1 : 4
    fprintf('  ');
    for j = 1 : 5
        fprintf('%4d  ', augMatrix(i,j));
    end
    fprintf('\n');
end
fprintf('\n');

% -----------------------------------------------------------------------
% Step 4: Solve the system with x2 as the free variable
%
% From the equations we can express x1, x3, x4 in terms of x2:
%
%   From equation 1:  x1 = u1 - x2  = 250 - x2
%   From equation 2:  x3 = x1 - u3  = (250 - x2) - 150 = 100 - x2
%   From equation 4:  x4 = u4 - x3  = 300 - (100 - x2) = 200 + x2
%
% We can verify equation 3: -x2 + x4 = -(x2) + (200 + x2) = 200 = u2  CHECK
% -----------------------------------------------------------------------
fprintf('--- General Solution (x2 is the free variable) ---\n\n');
fprintf('  x1 = 250 - x2\n');
fprintf('  x2 = x2      (free variable, can be any value)\n');
fprintf('  x3 = 100 - x2\n');
fprintf('  x4 = 200 + x2\n\n');

% -----------------------------------------------------------------------
% Step 5: Find traffic flows when x2 = 80
% -----------------------------------------------------------------------
x2 = 80;
x1 = 250 - x2;
x3 = 100 - x2;
x4 = 200 + x2;

fprintf('--- Traffic Flow when x2 = %d ---\n\n', x2);
fprintf('  x1 = 250 - %d = %d\n', x2, x1);
fprintf('  x2 = %d\n', x2);
fprintf('  x3 = 100 - %d = %d\n', x2, x3);
fprintf('  x4 = 200 + %d = %d\n\n', x2, x4);

% -----------------------------------------------------------------------
% Step 6: Find the upper limit for x2 (all flows must be nonnegative)
%
% For all traffic flows to be nonnegative (no negative flow allowed):
%   x1 >= 0  -->  250 - x2 >= 0  -->  x2 <= 250
%   x3 >= 0  -->  100 - x2 >= 0  -->  x2 <= 100   <-- this is the binding constraint
%   x4 >= 0  -->  200 + x2 >= 0  -->  x2 >= -200  (always satisfied for x2 >= 0)
%
% The tightest (smallest) upper bound comes from x3, so x2 <= 100
% -----------------------------------------------------------------------
fprintf('--- Upper Limit for x2 ---\n\n');
fprintf('For all traffic values to be nonnegative:\n');
fprintf('  x1 = 250 - x2 >= 0  -->  x2 <= 250\n');
fprintf('  x3 = 100 - x2 >= 0  -->  x2 <= 100  (this is the tightest constraint)\n');
fprintf('  x4 = 200 + x2 >= 0  -->  x2 >= -200 (always satisfied)\n\n');
fprintf('Therefore the upper limit for x2 is: 100\n\n');

% -----------------------------------------------------------------------
% Step 7: Street carrying x2 is closed, so x2 = 0
% -----------------------------------------------------------------------
x2_closed = 0;
x1_closed = 250 - x2_closed;
x3_closed = 100 - x2_closed;
x4_closed = 200 + x2_closed;

fprintf('--- Traffic Flow when Street x2 is Closed (x2 = 0) ---\n\n');
fprintf('  x1 = 250 - 0 = %d\n', x1_closed);
fprintf('  x2 = %d  (street is closed)\n', x2_closed);
fprintf('  x3 = 100 - 0 = %d\n', x3_closed);
fprintf('  x4 = 200 + 0 = %d\n\n', x4_closed);

fprintf('=================================================================\n');
fprintf('                      END OF PROJECT                            \n');
fprintf('=================================================================\n');
