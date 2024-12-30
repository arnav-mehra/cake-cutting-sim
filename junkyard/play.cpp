#include <iostream>
#include <Eigen/Dense>
#include <unsupported/Eigen/MatrixFunctions>
using namespace std;

template<typename MatrixType>
MatrixType pow(MatrixType M, int p) {
    if (p == 1) return M;
    MatrixType res_root = pow(M, p / 2);
    if (p % 2 == 0) {
        return res_root * res_root;
    }
    return res_root * res_root * M;
}

int main() {
    const double n = 100.0;
    const double k = n;
    // const double e = 1.0 / (k * k * k);
    
    // {
    //     double l = 1.0, u = 1.0;
    //     for (double t = 0.0; t < n; t++) {
    //         double a = 1.0 + 1.0 / (n - t);
    //         double bp = (1.0 + e * n * k) / (n - t);
    //         double bm = (1.0 - e * n * k) / (n - t) * ((k - 1.0) / k);

    //         double new_l = a * l - bp * u;
    //         double new_u = a * u - bm * l;
    //         l = new_l;
    //         u = new_u;
    //     }
    //     cout << l << ' ' << u << "\n\n";
    // }

    {
        for (float e = 1.0 / (k * n); e > 0.0; e /= n) {
            float max_u = 1.0 / (n * (k - 1.0) * (1.0 / (n * k) + e));
            cout << "max_u: " << max_u << '\n';

            const auto I = Eigen::Matrix<double, 2, 2>::Identity();
            auto M = Eigen::Matrix<double, 2, 2>();
            M(0, 0) = 1.0;
            M(0, 1) = -(1.0 + e * n * k);
            M(1, 0) = -(1.0 - e * n * k) * (1.0 - 1.0 / k);
            M(1, 1) = 1.0;

            auto v = Eigen::Vector<double, 2>().setOnes();
            for (double t = 0; t < n; t++) {
                v = (M / (n - t) + I) * v;
            }
            if (v(1) <= max_u) {
                cout << "e = " << e << '\n';
                break;
            } else {
                cout << "failed: " << v(1) << '\n';
            }
            // cout << v(0) << ' ' << v(1) << '\n';
        }
    }
    
    // {
    //     const auto I = Eigen::Matrix<double, 2, 2>::Identity();
    //     auto M = Eigen::Matrix<double, 2, 2>();
    //     M(0, 0) = 1.0;
    //     M(0, 1) = -(1.0 + e * n * k);
    //     M(1, 0) = -(1.0 - e * n * k) * (1.0 - 1.0 / k);
    //     M(1, 1) = 1.0;

    //     float d = powf(n, 0.899) * 0.28;
    //     auto v = Eigen::Vector<double, 2>().setOnes();
    //     for (double t = 0; t < n; t++) {
    //         v = (M / d + I) * v;
    //     }
    //     cout << d << '\n';
    //     cout << v(0) << ' ' << v(1) << '\n';
    // }

    // {
    //     const auto I = Eigen::Matrix<double, 2, 2>::Identity();
    //     auto M = Eigen::Matrix<double, 2, 2>();
    //     M(0, 0) = 1.0;
    //     M(0, 1) = -(1.0 + e * n * k);
    //     M(1, 0) = -(1.0 - e * n * k) * (1.0 - 1.0 / k);
    //     M(1, 1) = 1.0;

    //     float d = powf(n, 0.899) * 0.28;
    //     auto v = Eigen::Vector<double, 2>().setOnes();
    //     Eigen::Matrix<double, 2, 2> M_effective = M / d + I;
    //     v = pow(M_effective, n) * v;
    //     cout << d << '\n';
    //     cout << v(0) << ' ' << v(1) << '\n';
    // }

}